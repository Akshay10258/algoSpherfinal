// import { createContext, useState, useContext, useEffect } from 'react';

// // Create the context
// const ChatContext = createContext();

// // Custom hook to use the chat context
// export function useChat() {
//   return useContext(ChatContext);
// }

// // Provider component
// export function ChatProvider({ children }) {
//   const [messages, setMessages] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);

//   // Function to send a message
//   const sendMessage = async (text, language) => {
//     if (!text.trim()) return;
    
//     // Add user message
//     const userMessage = {
//       id: Date.now(),
//       text,
//       sender: 'user',
//       timestamp: new Date().toISOString()
//     };
    
//     setMessages(prevMessages => [...prevMessages, userMessage]);
    
//     // Simulate bot typing
//     setIsTyping(true);
    
//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Add bot response
//       const botMessage = {
//         id: Date.now() + 1,
//         text: `This is a simulated response to: "${text}"`,
//         sender: 'bot',
//         timestamp: new Date().toISOString()
//       };
      
//       setMessages(prevMessages => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Clear all messages
//   const clearMessages = () => {
//     setMessages([]);
//   };

//   // Context value
//   const value = {
//     messages,
//     sendMessage,
//     clearMessages,
//     isTyping
//   };

//   return (
//     <ChatContext.Provider value={value}>
//       {children}
//     </ChatContext.Provider>
//   );
// } 

// import { createContext, useContext, useState } from "react";

// // Create ChatContext
// const ChatContext = createContext();

// // Function to fetch chatbot response
// const getBotResponse = async (message) => {
//   try {
//     const response = await fetch("http://localhost:5000/chatbot", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message }),
//     });

//     if (!response.ok) {
//       throw new Error(`Server error: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.reply || "I'm sorry, I couldn't understand that.";
//   } catch (error) {
//     console.error("Error fetching chatbot response:", error);
//     return "I'm facing technical difficulties. Please try again later.";
//   }
// };

// // ChatProvider Component
// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);

//   const sendMessage = async (message) => {
//     // Add user message
//     const userMessage = {
//       id: Date.now(),
//       text: message,
//       sender: "user",
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setIsTyping(true);

//     // Fetch response from backend
//     const botResponse = await getBotResponse(message);

//     // Add bot message
//     const botMessage = {
//       id: Date.now() + 1,
//       text: botResponse,
//       sender: "bot",
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, botMessage]);
//     setIsTyping(false);
//   };

//   return (
//     <ChatContext.Provider value={{ messages, sendMessage, isTyping }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// // Custom hook for using ChatContext
// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// };

// export default ChatContext;

// ChatContext.jsx
import { createContext, useContext, useState } from "react";

// Create ChatContext
const ChatContext = createContext();

// Function to fetch chatbot response
const getBotResponse = async (message) => {
  try {
    const response = await fetch("http://localhost:5000/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "I'm sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "I'm facing technical difficulties. Please try again later.";
  }
};

// ChatProvider Component
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Fetch response from backend and store it
    const botResponse = await getBotResponse(message);

    // Add bot message
    const botMessage = {
      id: Date.now() + 1,
      text: botResponse,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);

    // Return bot response so it can be used in Chat.jsx
    return botResponse;
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isTyping }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for using ChatContext
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export default ChatContext;