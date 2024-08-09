import { CartItem } from '@/components/CartItem';
import { SignedInPage } from '@/components/guard/SignedInPage';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { axiosInstance } from '@/lib/axios';
import { getCart } from '@/services/cartService';
import { useSelector } from 'react-redux';

const CartPage = () => {
  const cartSelector = useSelector((state) => state.cart);
  const userSelector = useSelector((state) => state.user);

  const handleCheckout = async () => {
    // check if all items are available
    for (let i = 0; i < cartSelector.items.length; i++) {
      const currentCartItem = cartSelector.items[i];

      if (currentCartItem.quantity > currentCartItem.product.stock) {
        alert('One of your items is unavailable');
        return;
      }
    }

    // post all items to transaction history
    const totalPrice = cartSelector.items.reduce((a, b) => {
      return a + b.quantity * b.product.price;
    }, 0);
    const tax = totalPrice / 10;

    await axiosInstance.post('/transactions', {
      userId: userSelector.id,
      totalPrice,
      tax,
      transactionDate: new Date(),
      items: cartSelector.items,
    });

    // update stock
    cartSelector.items.forEach(async (cartItem) => {
      await axiosInstance.patch(`/products/${cartItem.productId}`, {
        stock: cartItem.product.stock - cartItem.quantity,
      });
    });

    // delete items in cart
    cartSelector.items.forEach(async (cartItem) => {
      await axiosInstance.delete(`/carts/${cartItem.id}`);
    });

    getCart(userSelector.id);

    alert('Checkout success');
  };

  return (
    <SignedInPage>
      <main className="min-h-screen max-w-screen-lg mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold">My Cart</h1>

        <div className="mt-10">
          <Separator />

          <div className="grid grid-cols-12 gap-8 my-8">
            <div className="col-span-7 gap-6 flex flex-col">
              {cartSelector.items.map((cartItem) => (
                <CartItem
                  key={cartItem.id}
                  name={cartItem.product.name}
                  price={cartItem.product.price}
                  imageUrl={cartItem.product.imageUrl}
                  quantity={cartItem.quantity}
                  stock={cartItem.product.stock}
                  cartId={cartItem.id}
                />
              ))}
            </div>

            {cartSelector.items.length ? (
              <Card className="col-span-5 bg-gray-50 border-0 h-min">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex pb-4 justify-between border-b">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span>
                      Rp{' '}
                      {cartSelector.items
                        .reduce((a, b) => {
                          return a + b.quantity * b.product.price;
                        }, 0)
                        .toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex py-4 justify-between border-b">
                    <span className="text-sm text-muted-foreground">
                      Taxes (10%)
                    </span>
                    <span>
                      Rp{' '}
                      {(
                        cartSelector.items.reduce((a, b) => {
                          return a + b.quantity * b.product.price;
                        }, 0) / 10
                      ).toLocaleString('id-ID')}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col flex gap-6">
                  <div className="flex justify-between w-full">
                    <span className="text-sm font-semibold">Order Total</span>
                    <span className="font-semibold">
                      Rp{' '}
                      {(
                        cartSelector.items.reduce((a, b) => {
                          return a + b.quantity * b.product.price;
                        }, 0) +
                        cartSelector.items.reduce((a, b) => {
                          return a + b.quantity * b.product.price;
                        }, 0) /
                          10
                      ).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <Button onClick={handleCheckout} className="w-full">
                    Checkout
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <span>No items</span>
            )}
          </div>
        </div>
      </main>
    </SignedInPage>
  );
};

export default CartPage;
