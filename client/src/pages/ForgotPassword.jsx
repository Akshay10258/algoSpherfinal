import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { FiMail, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [useClerkFallback, setUseClerkFallback] = useState(true);

  // Fallback password reset function when Clerk is not available
  const handleFallbackReset = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    // Simulate password reset for demo purposes
    setTimeout(() => {
      setMessage('If an account exists with this email, you will receive password reset instructions.');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {message && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{message}</p>
              </div>
            </div>
          </div>
        )}
        
        {!useClerkFallback ? (
          <div className="mt-8">
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Demo mode: For testing, you can use the fallback password reset form below.
              </p>
              <button 
                onClick={() => setUseClerkFallback(true)}
                className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Use fallback form
              </button>
            </div>
            
            <SignIn 
              path="/forgot-password"
              routing="path"
              initialStep="reset_password"
              signUpUrl="/signup"
              redirectUrl="/login"
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "bg-white dark:bg-gray-800 shadow-none",
                  headerTitle: "text-gray-900 dark:text-white",
                  headerSubtitle: "text-gray-600 dark:text-gray-400",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
                  formFieldLabel: "text-gray-700 dark:text-gray-300",
                  formFieldInput: "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                  footer: "text-gray-600 dark:text-gray-400",
                  footerActionLink: "text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                }
              }}
            />
          </div>
        ) : (
          <div className="mt-8">
            <form className="mt-8 space-y-6" onSubmit={handleFallbackReset}>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Sending reset link...' : 'Reset Password'}
                </button>
              </div>
              
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setUseClerkFallback(false)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Try Clerk authentication
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="text-center mt-4">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 