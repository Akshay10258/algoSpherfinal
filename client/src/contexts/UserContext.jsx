import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    // In a real app, you would validate credentials against a backend
    // For this demo, we'll just check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userInfo = { name: user.name, email: user.email };
      setCurrentUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return true;
    }
    return false;
  };

  // Signup function
  const signup = (name, email, password) => {
    // In a real app, you would send this data to a backend
    // For this demo, we'll just store it in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return false;
    }
    
    // Add new user
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log in the new user
    const userInfo = { name, email };
    setCurrentUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    
    return true;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
} 