import { SignedInPage } from '@/components/guard/SignedInPage';

const CartPage = () => {
  return (
    <SignedInPage>
      <div className="flex h-full justify-center items-center text-5xl font-bold">
        <p>Cart Page</p>
      </div>
    </SignedInPage>
  );
};

export default CartPage;
