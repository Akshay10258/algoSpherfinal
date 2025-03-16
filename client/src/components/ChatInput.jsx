import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

export default function ChatInput({ onSendMessage, loading }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
        disabled={loading}
      />
      <button
        type="submit"
        className={`p-2 rounded-r-md ${
          loading || !message.trim()
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        disabled={loading || !message.trim()}
      >
        {loading ? (
          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        ) : (
          <FiSend />
        )}
      </button>
    </form>
  );
} 