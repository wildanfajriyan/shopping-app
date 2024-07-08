import { ProductCard } from '../components/ProductCard';

const productsRaw = [
  {
    name: 'Dark Green Long Fit',
    price: 110000,
    imageUrl:
      'https://d29c1z66frfv6c.cloudfront.net/pub/media/catalog/product/large/d386614fb183c97bec016e19f0d0c3fff44ebca6_xxl-1.jpg',
    stock: 4,
  },
  {
    name: 'Dark Blue T-shirt',
    price: 120000,
    imageUrl:
      'https://d29c1z66frfv6c.cloudfront.net/pub/media/catalog/product/large/fdcf591cc8bb49df622e0a0198e61233c7005de3_xxl-1.jpg',
    stock: 0,
  },
];

const HomePage = () => {
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

        <div className="grid grid-cols-2 gap-4">
          {productsRaw.map((product, i) => (
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
