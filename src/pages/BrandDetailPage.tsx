import { useParams } from "react-router-dom";

export const BrandDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Brand Details</h2>
      <p className="text-gray-600">Viewing brand: {id}</p>
    </div>
  );
};

