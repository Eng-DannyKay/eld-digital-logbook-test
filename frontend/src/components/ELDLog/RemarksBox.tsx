
export default function RemarksBox({ remarks }: { readonly remarks: string }) {
  return (
    <div>
      <h4 className="font-semibold text-secondary mb-2">Remarks</h4>
      <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700">
        {remarks || "No remarks provided."}
      </div>
    </div>
  );
}
