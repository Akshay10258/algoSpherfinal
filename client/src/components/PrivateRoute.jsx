import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { FiLoader } from 'react-icons/fi';

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useUser();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <FiLoader className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-700 dark:text-gray-300">Loading...</span>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in, render the protected component
  return children;
} 