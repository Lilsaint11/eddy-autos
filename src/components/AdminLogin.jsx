import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';
import { SignIn } from '@clerk/clerk-react';
import { ShieldAlert, LogIn, Key, User } from 'lucide-react';

const AdminLogin = () => {
  const { isClerkEnabled, isSignedIn, login, isLoaded } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/admin');
    }
  }, [isSignedIn, isLoaded, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid username or password.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500 border-r-2"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-650/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <img 
            src="/images/eddy1.png" 
            alt="Eddy Autos" 
            className="mx-auto w-36 cursor-pointer"
            onClick={() => navigate('/')} 
          />
          <h2 className="mt-6 text-center text-3xl font-black text-white tracking-tight uppercase">
            Admin <span className="text-red-500">Portal</span>
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Secure administrative control panel
          </p>
        </div>

        {isClerkEnabled ? (
          <div className="flex justify-center mt-8 bg-zinc-900 border border-white/5 p-6 rounded-3xl shadow-2xl">
            <SignIn 
              signUpUrl={null} // Disable sign up as it is an admin portal
              afterSignInUrl="/admin"
              appearance={{
                variables: {
                  colorPrimary: '#ef4444',
                  colorBackground: '#18181b',
                  colorText: '#ffffff',
                  colorInputBackground: '#27272a',
                  colorInputText: '#ffffff',
                  colorTextSecondary: '#a1a1aa',
                },
                elements: {
                  card: 'bg-zinc-900 border border-white/5 shadow-none p-0',
                  headerTitle: 'text-white text-xl font-bold uppercase tracking-tight',
                  headerSubtitle: 'text-zinc-400 text-xs',
                  socialButtonsBlockButton: 'bg-zinc-800 border border-white/10 text-white hover:bg-zinc-750 transition-all',
                  socialButtonsBlockButtonText: 'text-white font-bold',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-zinc-500 text-[10px] uppercase font-bold tracking-widest',
                  formFieldLabel: 'text-zinc-400 text-xs font-bold uppercase tracking-wider',
                  formButtonPrimary: 'bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-3 text-xs rounded-xl shadow-lg active:scale-95 transition-all',
                  footerActionLink: { display: 'none' },
                  footer: { display: 'none' },
                }
              }}
            />
          </div>
        ) : (
          <div className="bg-zinc-900/60 border border-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-2xl p-4 flex gap-3 items-start">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block uppercase tracking-wide mb-0.5">Development Mock Auth Mode</span>
                To use production-ready authentication, configure <code className="bg-black/40 px-1 py-0.5 rounded text-red-400">VITE_CLERK_PUBLISHABLE_KEY</code> in a <code className="bg-black/40 px-1 py-0.5 rounded text-white">.env</code> file.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl p-3 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-all placeholder-zinc-600"
                    placeholder="Enter admin username"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Key size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-all placeholder-zinc-600"
                    placeholder="Enter admin password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg mt-6"
              >
                <LogIn size={14} />
                Access Dashboard
              </button>
            </form>

            <div className="text-center text-[10px] text-zinc-500">
              Credentials: <span className="text-zinc-400 font-bold">admin</span> / <span className="text-zinc-400 font-bold">admin</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-zinc-500 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
