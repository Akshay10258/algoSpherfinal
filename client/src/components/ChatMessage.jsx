import React from 'react';
import { FiUser, FiMessageSquare } from 'react-icons/fi';
import { format } from 'date-fns';

export default function ChatMessage({ message }) {
  const { text, timestamp, sender } = message;
  const isUser = sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        }`}
      >
        <p className="text-sm">{text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
          {format(new Date(timestamp), 'h:mm a')}
        </p>
      </div>
    </div>
  );
} 