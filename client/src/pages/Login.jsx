import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && currentUser) {
      navigate('/chat', { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/chat', { replace: true });
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account? <Link to="/signup" className="text-indigo-600">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}