from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Trip
from .serializers import TripInputSerializer, TripOutputSerializer
from .eld_calculator import ELDCalculator

@swagger_auto_schema(
    method='post',
    operation_description="Calculate trip route and generate ELD logs",
    request_body=TripInputSerializer,
    responses={
        200: openapi.Response(
            description="Successful calculation",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'calculation': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'route_instructions': openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(type=openapi.TYPE_OBJECT)
                            ),
                            'daily_logs': openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(type=openapi.TYPE_OBJECT)
                            ),
                            'total_distance': openapi.Schema(type=openapi.TYPE_NUMBER)
                        }
                    ),
                    'trip': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'current_location': openapi.Schema(type=openapi.TYPE_STRING),
                            'pickup_location': openapi.Schema(type=openapi.TYPE_STRING),
                            'dropoff_location': openapi.Schema(type=openapi.TYPE_STRING),
                            'current_cycle_used': openapi.Schema(type=openapi.TYPE_NUMBER),
                            'created_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                        }
                    )
                }
            )
        ),
        400: openapi.Response(
            description="Bad request",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        )
    }
)
@api_view(['POST'])
def calculate_trip(request):
    """
    Calculate optimal route and generate ELD-compliant daily logs.
    
    - **Property-carrying driver rules apply**: 70hrs/8days cycle
    - **Mandatory breaks**: 30-minute break after 8 hours of driving
    - **Fuel stops**: Every 1,000 miles
    - **Service times**: 1 hour each for pickup and drop-off
    """
    data = request.data
    
    try:
        # Validate input
        input_serializer = TripInputSerializer(data=data)
        input_serializer.is_valid(raise_exception=True)
        
        # Calculate trip using ELD calculator
        result = ELDCalculator.calculate_trip_plan(
            current_location=data['current_location'],
            pickup=data['pickup_location'],
            dropoff=data['dropoff_location'],
            current_cycle_used=float(data['current_cycle_used'])
        )
        
        # Save trip to database
        trip = Trip.objects.create(
            current_location=data['current_location'],
            pickup_location=data['pickup_location'],
            dropoff_location=data['dropoff_location'],
            current_cycle_used=float(data['current_cycle_used'])
        )
        
        # Return both calculation result and saved trip data
        response_data = {
            'calculation': result,
            'trip': TripOutputSerializer(trip).data
        }
        
        return Response(response_data)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TripViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows trips to be viewed or edited.
    """
    queryset = Trip.objects.all().order_by('-created_at')
    serializer_class = TripOutputSerializer