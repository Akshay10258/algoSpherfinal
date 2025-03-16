import { Link } from 'react-router-dom';
import { FiMessageSquare, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">Quickcred</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Your intelligent chatbot assistant for quick and reliable information.
          </p>
          
          <div className="mt-8 flex justify-center">
            <Link
              to="/chat"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Try Chat <FiMessageSquare className="ml-2" />
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Instant Answers</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Get quick and accurate responses to your questions without having to search through multiple sources.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">24/7 Availability</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Our chatbot is available around the clock to assist you whenever you need help.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Secure & Private</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Your conversations are encrypted and your data is kept private and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 