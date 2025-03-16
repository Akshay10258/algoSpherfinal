import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

const Header = () => {
  const { t, changeLanguage, languages, currentLanguage } = useLanguage();
  const { user, logout, isAuthenticated } = useUser();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
  };
  
  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setIsLanguageMenuOpen(false);
  };
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md relative z-30 py-4">
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Quickcred Logo - No Hover Effect */}
          <Link to="/" className="text-xl text-black md:text-2xl font-bold hover:no-underline hover:text-black">
            Quickcred
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition-colors"
                aria-label="Select language"
              >
                <span>{languages.find(lang => lang.code === currentLanguage)?.name || 'Language'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-40">
                  <ul className="py-1">
                    {languages.map((lang) => (
                      <li key={lang.code}>  
                        <button
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            currentLanguage === lang.code ? 'bg-gray-100 font-medium' : ''
                          }`}
                        >
                          {lang.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden lg:inline text-gray-200">{user.name}</span>
                <button 
                  onClick={logout}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition-colors"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-500 pt-4 bg-gradient-to-r from-blue-600 to-indigo-700 z-40 px-4">
            <div className="flex flex-col space-y-4">
              {/* Language Selector for Mobile */}
              <div className="relative">
                <button 
                  onClick={toggleLanguageMenu}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  aria-label="Select language"
                >
                  <span>{languages.find(lang => lang.code === currentLanguage)?.name || 'Language'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isLanguageMenuOpen && (
                  <div className="mt-2 w-full bg-white text-gray-800 rounded-md shadow-lg z-50">
                    <ul className="py-1">
                      {languages.map((lang) => (
                        <li key={lang.code}>
                          <button
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                              currentLanguage === lang.code ? 'bg-gray-100 font-medium' : ''
                            }`}
                          >
                            {lang.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Authentication Buttons for Mobile */}
              {isAuthenticated ? (
                <div className="flex flex-col space-y-4">
                  <span className="px-4 text-gray-200">{user.name}</span>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-md bg-white text-blue-600 hover:bg-gray-100 transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 rounded-md bg-white text-blue-600 hover:bg-gray-100 transition-colors"
                  >
                    {t('signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;