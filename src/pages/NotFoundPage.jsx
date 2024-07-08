import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-screen h-screen">
      <p>404 - Page not Found</p>
      <Link to="/">back to home</Link>
    </div>
  );
};

export default NotFoundPage;
