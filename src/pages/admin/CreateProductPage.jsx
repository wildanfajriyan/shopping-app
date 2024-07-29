import { AdminLayout } from '@/components/layout/AdminLayout';
import { axiosInstance } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '@/components/ProductForm';

const CreateProductPage = () => {
  const navigate = useNavigate();

  const handleCreateProduct = async (values) => {
    try {
      await axiosInstance.post('/products', values);

      alert('product created');

      navigate('/admin/products');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout title="Create Products" description="Add new products">
      <ProductForm onSubmit={handleCreateProduct} cardTitle="Add new Product" />
    </AdminLayout>
  );
};

export default CreateProductPage;
