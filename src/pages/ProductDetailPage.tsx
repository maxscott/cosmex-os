import { useParams } from "react-router-dom";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
      <p className="text-gray-600">Viewing product: {id}</p>
    </div>
  );
};

