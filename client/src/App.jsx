// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { LanguageProvider } from './contexts/LanguageContext';
// import { UserProvider } from './contexts/UserContext';
// import { ChatProvider } from './contexts/ChatContext';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Chat from './pages/Chat';
// import './index.css';

// function App() {
//   return (
//     <Router>
//       <LanguageProvider>
//         <UserProvider>
//           <ChatProvider>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/chat" element={<Chat />} />
//             </Routes>
//           </ChatProvider>
//         </UserProvider>
//       </LanguageProvider>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ChatProvider } from './contexts/ChatContext';

// Footer component that only shows on non-chat pages
function FooterWrapper() {
  const location = useLocation();
  const isChat = location.pathname === '/chat';
  
  if (isChat) return null;
  
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Quickcred. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <ChatProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/chat" 
                    element={
                      <PrivateRoute>
                        <Chat />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                </Routes>
              </main>
              <FooterWrapper />
            </div>
          </Router>
        </ChatProvider>
      </LanguageProvider>
    </UserProvider>
  );
}

export default App;