import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const AdminPage = ({ children }) => {
  const userSelector = useSelector((state) => state.user);

  if (userSelector.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};
