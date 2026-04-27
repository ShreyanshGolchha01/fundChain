import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coins, LogOut, LayoutDashboard, PlusCircle, Blocks } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">FundChain</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Campaigns
              </Link>
              <Link to="/explorer" className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center space-x-1">
                <Blocks className="h-4 w-4" />
                <span>Explorer</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end mr-4">
                  <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 capitalize font-medium">
                    {user.role}
                  </span>
                </div>
                
                {user.role === 'creator' && (
                  <>
                    <Link to="/create-campaign" className="p-2 text-gray-600 hover:text-primary transition-colors bg-gray-50 hover:bg-blue-50 rounded-full" title="Create Campaign">
                      <PlusCircle className="h-5 w-5" />
                    </Link>
                    <Link to="/dashboard" className="p-2 text-gray-600 hover:text-primary transition-colors bg-gray-50 hover:bg-blue-50 rounded-full" title="Dashboard">
                      <LayoutDashboard className="h-5 w-5" />
                    </Link>
                  </>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-danger hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
