import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-react';

const MockAuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    return localStorage.getItem('eddy_autos_mock_auth') === 'true';
  });
  const [user, setUser] = useState(() => {
    return localStorage.getItem('eddy_autos_mock_auth') === 'true' 
      ? { name: 'Eddy Admin', email: 'eddy@autos.com', imageUrl: '/images/eddy1.png' } 
      : null;
  });

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setIsSignedIn(true);
      setUser({ name: 'Eddy Admin', email: 'eddy@autos.com', imageUrl: '/images/eddy1.png' });
      localStorage.setItem('eddy_autos_mock_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsSignedIn(false);
    setUser(null);
    localStorage.removeItem('eddy_autos_mock_auth');
  };

  return (
    <MockAuthContext.Provider value={{ isSignedIn, user, login, logout, isLoaded: true }}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  return context;
};

export const AuthProvider = ({ children }) => {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (clerkPublishableKey) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        {children}
      </ClerkProvider>
    );
  }

  return (
    <MockAuthProvider>
      {children}
    </MockAuthProvider>
  );
};

export const useAdminAuth = () => {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled = !!clerkPublishableKey;

  if (isClerkEnabled) {
    const { userId, isLoaded: isAuthLoaded, signOut } = useAuth();
    const { user, isLoaded: isUserLoaded } = useUser();
    
    const isLoaded = isAuthLoaded && isUserLoaded;
    const allowedAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'eddy@autos.com')
      .split(',')
      .map(email => email.trim().toLowerCase());
    
    const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
    const isAuthorized = !!userId && !!userEmail && allowedAdminEmails.includes(userEmail);

    useEffect(() => {
      if (isLoaded && userId && !isAuthorized) {
        signOut();
      }
    }, [isLoaded, userId, isAuthorized, signOut]);

    return {
      isClerkEnabled,
      isLoaded,
      isSignedIn: isAuthorized,
      user: isAuthorized ? {
        name: user.fullName || user.username || 'Admin User',
        imageUrl: user.imageUrl,
        email: user.primaryEmailAddress?.emailAddress
      } : null,
      signOut,
      login: null,
    };
  } else {
    const mockAuth = useMockAuth();
    return {
      isClerkEnabled,
      isLoaded: mockAuth ? mockAuth.isLoaded : true,
      isSignedIn: mockAuth ? mockAuth.isSignedIn : false,
      user: mockAuth ? mockAuth.user : null,
      signOut: mockAuth ? mockAuth.logout : () => {},
      login: mockAuth ? mockAuth.login : () => false,
    };
  }
};
