import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { authService } from './AuthService';

type User = {
  access: string;
  refresh: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const handleLogin = async (email: string, password: string) => {
    try {
      const tokens = await authService.login({ email, password });
      setUser(tokens);
      navigate('/');
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleRegister = async (
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      await authService.register({
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        re_password: confirmPassword
      });
      
      // Auto-login after registration
      await handleLogin(email, password);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login: handleLogin,
      logout: handleLogout,
      register: handleRegister,
    }}>
      {children}
    </AuthContext.Provider>
  );
};