import { useState } from 'react';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export const ProductCard = ({ id, imageUrl, name, price, stock }) => {
  const [quantity, setQuantity] = useState(0);

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

  const addToCart = () => {
    alert('add to cart pressed');
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
        <Button disabled={!stock} className="w-full" onClick={addToCart}>
          {!stock ? 'Out of stock' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
};
