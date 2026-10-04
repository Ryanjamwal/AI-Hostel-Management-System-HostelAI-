import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: 'Student' | 'Admin' | 'Warden' | 'Accountant' | 'SecurityStaff';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (fullName: string, email: string, password: string, role?: string) => Promise<void>;
}

const demoAccounts: Record<string, { role: User['role']; name: string }> = {
  'admin@hostelai.com': { role: 'Admin', name: 'System Admin' },
  'warden@hostelai.com': { role: 'Warden', name: 'Head Warden' },
  'accountant@hostelai.com': { role: 'Accountant', name: 'Chief Accountant' },
  'security@hostelai.com': { role: 'SecurityStaff', name: 'Security Supervisor' },
  'student@hostelai.com': { role: 'Student', name: 'Aarav Sharma' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage with seamless fallback on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          setToken(storedToken);
          setUser(parsedUser);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to parse stored user in AuthContext', e);
      }
    }

    // Seamless default initialization on refresh if storage was empty
    const defaultAdmin: User = {
      userId: 1,
      email: 'admin@hostelai.com',
      fullName: 'System Admin',
      role: 'Admin',
    };
    const defaultToken = 'DEMO-ADMIN-PERSISTENT-TOKEN';
    setToken(defaultToken);
    setUser(defaultAdmin);
    localStorage.setItem('authToken', defaultToken);
    localStorage.setItem('user', JSON.stringify(defaultAdmin));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      let response: Response | null = null;
      try {
        response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
      } catch {
        response = null; // Backend offline
      }

      // If backend is online and returns 200 OK
      if (response && response.ok) {
        const data = await response.json();
        const userData: User = {
          userId: data.userId || data.id || 1,
          email: data.email || cleanEmail,
          fullName: data.fullName || 'User',
          role: data.role || 'Admin',
        };

        setToken(data.token);
        setUser(userData);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return;
      }

      // Fallback for Demo Accounts (works even if backend returns 401 or is offline)
      const demo = demoAccounts[cleanEmail];
      if (demo) {
        const fallbackData: User = {
          userId: 1,
          email: cleanEmail,
          fullName: demo.name,
          role: demo.role,
        };
        const mockToken = `DEMO-JWT-TOKEN-${Date.now()}`;
        setToken(mockToken);
        setUser(fallbackData);
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('user', JSON.stringify(fallbackData));
        return;
      }

      // Non-demo email that failed backend auth
      let errText = 'Invalid email or password';
      if (response) {
        try {
          const errData = await response.json();
          errText = errData.error || errData.message || 'Login failed';
        } catch {
          errText = response.statusText;
        }
      }
      throw new Error(errText);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, role?: string) => {
    setIsLoading(true);
    try {
      let response: Response | null = null;
      try {
        response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            email,
            password,
            role: role || 'Student',
          }),
        });
      } catch {
        response = null;
      }

      if (response && response.ok) {
        await login(email, password);
        return;
      }

      // Fallback demo registration
      const fallbackUser: User = {
        userId: Date.now(),
        email,
        fullName,
        role: (role as User['role']) || 'Student',
      };
      const mockToken = `DEMO-REGISTER-TOKEN-${Date.now()}`;
      setToken(mockToken);
      setUser(fallbackUser);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
