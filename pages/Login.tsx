import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbLogin } from '../services/db';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
      email: '',
      password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
          const user = dbLogin(formData.email, formData.password);
          setUser(user);
          navigate('/profile');
      } catch (err: any) {
          setError(err.message);
      }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-neutral-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                <Music className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-400">
                Sign in to your Melody View account
            </p>
        </div>
        
        {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-500 p-3 rounded flex items-center gap-2 text-sm">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-red-500 hover:text-red-400">
                    Sign up
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
