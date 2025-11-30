import { useParams } from "react-router-dom";

export const ThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Thread Details</h2>
      <p className="text-gray-600">Viewing thread: {id}</p>
      <div className="mt-4">
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Respond
        </button>
      </div>
    </div>
  );
};

