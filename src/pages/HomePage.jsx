import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { axiosInstance } from '@/lib/axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');

      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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

        <button onClick={getProducts}>fetch</button>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product, i) => (
            <ProductCard
              key={i}
              imageUrl={product.imageUrl}
              name={product.name}
              price={product.price}
              stock={product.stock}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default HomePage;
