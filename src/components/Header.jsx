import { IoCart, IoHeart } from 'react-icons/io5';
import { Separator } from './ui/separator';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { axiosInstance } from '@/lib/axios';
import { useEffect } from 'react';
import { getCart } from '@/services/cartService';

export const Header = () => {
  const userSelector = useSelector((state) => state.user);
  const cartSelector = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('current-user');

    dispatch({ type: 'USER_LOGOUT' });
  };

  useEffect(() => {
    getCart(userSelector.id);
  }, []);

  return (
    <header className="h-16 border-b flex items-center justify-between px-10">
      {/* BRAND */}
      <Link to="/">
        <p className="text-2xl font-bold hover:cursor-pointer">e-commerce</p>
      </Link>

      {/* SEARCH BAR */}
      <Input className="max-w-[600px]" placeholder="Search products..." />

      {/* BUTTONS */}
      <div className="flex space-x-4 h-5 items-center">
        <div className="flex space-x-2">
          <Link to="/cart">
            <Button variant="ghost">
              <IoCart className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">
                {cartSelector.items.length}
              </span>
            </Button>
          </Link>

          <Button size="icon" variant="ghost">
            <IoHeart className="h-6 w-6" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-full" />

        <div className="flex space-x-2 items-center">
          {userSelector.id ? (
            <>
              <h3>
                Hello {userSelector.username} ({userSelector.role})
              </h3>
              <Button onClick={handleLogout} variant="destructive">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button>Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
