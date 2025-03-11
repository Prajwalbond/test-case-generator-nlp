
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Braces, Folder, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-sm dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Braces className="h-6 w-6 text-teal-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">TestGen</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'border-teal-500 text-teal-700' : 'border-transparent text-gray-500 hover:border-teal-500 hover:text-teal-700'} dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
              <Link 
                to="/projects" 
                className={`${isActive('/projects') ? 'border-teal-500 text-teal-700' : 'border-transparent text-gray-500 hover:border-teal-500 hover:text-teal-700'} dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Folder className="mr-2 h-4 w-4" />
                Projects
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="outline" className="ml-3">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
