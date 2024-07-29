import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProductForm } from '@/components/ProductForm';
import { axiosInstance } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    price: 0,
    imageUrl: '',
    stock: 0,
    id: 0,
  });

  const getProduct = async () => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProduct = async (values) => {
    try {
      await axiosInstance.patch(`/products/${product.id}`, values);

      alert('Product edited');

      navigate('/admin/products');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <AdminLayout title="Edit Product" description="Editing Product">
      {product.id && (
        <ProductForm
          onSubmit={handleEditProduct}
          cardTitle={`Editing ${product.name}`}
          defaultName={product.name}
          defaultPrice={product.price}
          defaultStock={product.stock}
          defaultImageUrl={product.imageUrl}
        />
      )}
    </AdminLayout>
  );
};

export default EditProductPage;
