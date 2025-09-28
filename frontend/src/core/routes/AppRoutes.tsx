import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home/Home";
import TripDetails from "../../pages/TripDetails/TripDetails";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function AppRoutes() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trip" element={<TripDetails />} />
        {/* <Route path="/logs" element={<Logs />} /> */}
    <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      <Footer/>
    </>
  );
}

export default AppRoutes