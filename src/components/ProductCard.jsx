import { useState } from 'react';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import { useSelector } from 'react-redux';
import { getCart } from '@/services/cartService';

export const ProductCard = ({ id, imageUrl, name, price, stock }) => {
  const [quantity, setQuantity] = useState(0);
  const userSelector = useSelector((state) => state.user);

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < stock) {
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

  return (
    <div className="p-4 border rounded-md md:max-w-96 flex flex-col gap-4">
      <Link
        to={`product/${id}`}
        className="aspect-square w-full overflow-hidden"
      >
        <img className="w-full" src={imageUrl} alt="product" />
      </Link>

      <Link to={`product/${id}`}>
        <p className="text-md">{name}</p>
        <p className="text-xl font-semibold">
          Rp {price.toLocaleString('id-ID')}
        </p>
        <p className="text-muted-foreground text-sm">In stock: {stock}</p>
      </Link>

      <div className="flex flex-col gap-4">
        {/* BUTTON QUANTITY */}
        <div className="flex justify-between items-center">
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
            disabled={quantity >= stock}
            size="icon"
            variant="ghost"
            onClick={incrementQuantity}
          >
            <IoIosAdd className="h-6 w-6" />
          </Button>
        </div>

        {/* BUTTON ADD TO CART */}
        <Button
          disabled={!stock || quantity < 1}
          className="w-full"
          onClick={addToCart}
        >
          {!stock ? 'Out of stock' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
};
