import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import type { NavigationProps } from '../types';

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/home' },
    { id: 'alerts', label: 'Alerts', icon: '⚠️', path: '/alerts' },
    { id: 'current-state', label: 'Current State', icon: '🔴', path: '/current-state' }
  ];

  // Sync activeTab with current URL
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab && currentTab.id !== activeTab) {
      onTabChange(currentTab.id);
    }
  }, [location.pathname, activeTab, onTabChange]);

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleTabClick = (tabId: string, path: string) => {
    onTabChange(tabId);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div
          className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 ${
            isDesktopExpanded ? 'w-64' : 'w-16'
          }`}
          onMouseEnter={() => setIsDesktopExpanded(true)}
          onMouseLeave={() => setIsDesktopExpanded(false)}
        >
          {/* Logo/Brand */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            {isDesktopExpanded ? (
              <h1 className="text-lg font-bold text-gray-900">Weather Alert</h1>
            ) : (
              <div className="text-2xl">🌤️</div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.path)}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-xl mr-3">{tab.icon}</span>
                <span 
                  className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${
                    isDesktopExpanded 
                      ? 'opacity-100 max-w-32' 
                      : 'opacity-0 max-w-0 overflow-hidden'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content margin for desktop */}
        <div className="lg:ml-16"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-bold text-gray-900">Weather Alert</h1>
            <button
              className="hamburger-button p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"></div>
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`mobile-menu fixed top-0 left-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '280px' }}
        >
          {/* Mobile Menu Header */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-900">Weather Alert</h1>
          </div>

          {/* Mobile Navigation Items */}
          <nav className="mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.path)}
                className={`w-full flex items-center px-6 py-4 text-left transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-xl mr-4">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content margin for mobile */}
        <div className="h-16"></div>
      </div>
    </>
  );
};

export default Navigation;
