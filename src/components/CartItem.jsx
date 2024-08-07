import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { Button } from './ui/button';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { axiosInstance } from '@/lib/axios';
import { useSelector } from 'react-redux';
import { getCart } from '@/services/cartService';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const CartItem = ({
  name,
  price,
  imageUrl,
  quantity,
  stock,
  cartId,
}) => {
  const userSelector = useSelector((state) => state.user);
  const [quantityCart, setQuantityCart] = useState(quantity);

  const debouncedUpdateCart = useDebouncedCallback(() => {
    updateCartQuantity();
  }, 2000);

  const removeCartItem = async () => {
    try {
      await axiosInstance.delete(`/carts/${cartId}`);

      getCart(userSelector.id);
      alert('Item removed');
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartQuantity = async () => {
    try {
      await axiosInstance.patch(`/carts/${cartId}`, {
        quantity: quantityCart,
      });

      getCart(userSelector.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    debouncedUpdateCart();
  }, [quantityCart]);

  return (
    <div className="flex gap-4">
      <div className="aspect-square w-full overflow-hidden rounded-md max-w-52">
        <img src={imageUrl} alt={name} className="w-full" />
      </div>

      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-col">
          <p>{name}</p>
          <p className="font-bold">Rp {price.toLocaleString('id-ID')}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            disabled={quantityCart < 2}
            onClick={() => setQuantityCart(quantityCart - 1)}
            variant="ghost"
            size="icon"
          >
            <IoIosRemove className="w-4 h-4" />
          </Button>
          <p className="text-lg font-bold">{quantityCart}</p>
          <Button
            disabled={quantityCart >= stock}
            onClick={() => setQuantityCart(quantityCart + 1)}
            variant="ghost"
            size="icon"
          >
            <IoIosAdd className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            {stock < quantity ? (
              <>
                <IoClose className="text-red-500 w-6 h-6" />
                <span className="text-sm text-muted-foreground">
                  Not Available
                </span>
              </>
            ) : (
              <>
                <IoCheckmark className="text-green-500 w-6 h-6" />
                <span className="text-sm text-muted-foreground">Available</span>
              </>
            )}
          </div>

          <Button
            onClick={removeCartItem}
            className="text-destructive"
            variant="link"
          >
            Remove item
          </Button>
        </div>
      </div>
    </div>
  );
};
