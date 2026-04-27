import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coins, Mail, Lock, User, Briefcase } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register(formData.name, formData.email, formData.password, formData.role);
    if (success) {
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center">
          <div className="mx-auto bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Join the decentralized funding platform.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-gray-50 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-gray-50 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border-2 rounded-xl p-4 flex flex-col items-center cursor-pointer transition-colors ${formData.role === 'donor' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <input type="radio" name="role" value="donor" className="sr-only" checked={formData.role === 'donor'} onChange={handleChange} />
                  <Coins className={`h-6 w-6 mb-2 ${formData.role === 'donor' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={`text-sm font-bold ${formData.role === 'donor' ? 'text-primary' : 'text-gray-600'}`}>Donate Funds</span>
                </label>
                <label className={`border-2 rounded-xl p-4 flex flex-col items-center cursor-pointer transition-colors ${formData.role === 'creator' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <input type="radio" name="role" value="creator" className="sr-only" checked={formData.role === 'creator'} onChange={handleChange} />
                  <Briefcase className={`h-6 w-6 mb-2 ${formData.role === 'creator' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={`text-sm font-bold ${formData.role === 'creator' ? 'text-primary' : 'text-gray-600'}`}>Start Campaign</span>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 font-medium mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-blue-700 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
