import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { IoHeartOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { getCart } from '@/services/cartService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const userSelector = useSelector((state) => state.user);

  const [product, setProduct] = useState({
    name: '',
    price: 0,
    imageUrl: '',
    stock: 0,
    id: 0,
  });
  const [productIsLoading, setProductIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);

  const getProduct = async () => {
    try {
      setProductIsLoading(true);
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setProductIsLoading(false);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = async () => {
    if (!userSelector.id) {
      alert('please login first');
      return;
    }

    try {
      const cartResponse = await axiosInstance.get('/carts', {
        params: {
          userId: userSelector.id,
          _embed: 'product',
        },
      });

      const existingProduct = cartResponse.data.find((cart) => {
        return cart.productId === id;
      });

      if (!existingProduct) {
        await axiosInstance.post('/carts', {
          userId: userSelector.id,
          productId: id,
          quantity,
        });
      } else {
        if (
          existingProduct.quantity + quantity >
          existingProduct.product.stock
        ) {
          alert('Quantity is over the stock');
          return;
        }

        await axiosInstance.patch(`/carts/${existingProduct.id}`, {
          quantity: existingProduct.quantity + quantity,
        });
      }

      alert('Item added to cart');
      getCart(userSelector.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <main className="min-h-screen max-w-screen-lg mx-auto px-4 mt-8">
      <div className="grid grid-cols-2 gap-8">
        {productIsLoading ? (
          <Skeleton className="w-full h-[582px]" />
        ) : (
          <img src={product.imageUrl} alt="product" className="w-full" />
        )}

        <div className="flex flex-col gap-1 justify-center">
          {productIsLoading ? (
            <Skeleton className="w-[250px] h-[32px]" />
          ) : (
            <h1 className="text-xl">{product.name}</h1>
          )}

          {productIsLoading ? (
            <Skeleton className="w-[350px] h-[48px]" />
          ) : (
            <>
              <h3 className="text-3xl font-bold">
                Rp {product.price.toLocaleString('id-ID')}
              </h3>
              <p className="text-muted-foreground text-sm">
                In stock: {product.stock}
              </p>
            </>
          )}

          {productIsLoading ? (
            <Skeleton className="w-[350px] h-[120px] mt-4" />
          ) : (
            <p className="text-sm text-muted-foreground mt-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id
              necessitatibus possimus error impedit voluptas maiores cum quae
              fugiat rerum dolor.
            </p>
          )}

          <div className="flex items-center gap-3 mt-6">
            <Button
              disabled={quantity === 0}
              size="icon"
              variant="ghost"
              onClick={decrementQuantity}
            >
              <IoIosRemove className="h-6 w-6" />
            </Button>

            <p className="text-lg font-bold">{quantity}</p>

            <Button
              disabled={quantity >= product.stock}
              size="icon"
              variant="ghost"
              onClick={incrementQuantity}
            >
              <IoIosAdd className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center mt-4 gap-4">
            <Button onClick={addToCart} className="w-full" size="lg">
              Add to cart
            </Button>

            <Button size="icon" variant="ghost">
              <IoHeartOutline className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
