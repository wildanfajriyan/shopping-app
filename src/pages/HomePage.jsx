import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { axiosInstance } from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [productsIsLoading, setProductsIsLoading] = useState(false);

  const getProducts = async () => {
    setProductsIsLoading(true);
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setProductsIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <main className="min-h-[80vh] max-w-screen-md mx-auto px-4 mt-8">
        <div className="pb-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Become a trend-setter with us
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            e-commerce provides you with the finest clothings and ensures your
            confidence throughout your days
          </p>
        </div>

        {productsIsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="w-[360px] h-[560px]" />
            <Skeleton className="w-[360px] h-[560px]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                name={product.name}
                price={product.price}
                stock={product.stock}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default HomePage;
