import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type UserRole = 'Student' | 'Admin' | 'Warden' | 'Accountant' | 'SecurityStaff';

export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
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

interface AuthResponse {
  userId?: number | string;
  id?: number | string;
  email?: string;
  fullName?: string;
  role?: string;
  token?: string;
}

const apiBaseUrl = 'http://localhost:5000/api';
const validRoles: UserRole[] = ['Student', 'Admin', 'Warden', 'Accountant', 'SecurityStaff'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseUser = (data: AuthResponse): User => {
  const userId = Number(data.userId ?? data.id);
  if (
    !Number.isInteger(userId)
    || userId <= 0
    || !data.email
    || !data.fullName
    || !data.role
    || !validRoles.includes(data.role as UserRole)
  ) {
    throw new Error('The server returned an invalid user profile.');
  }

  return {
    userId,
    email: data.email,
    fullName: data.fullName,
    role: data.role as UserRole,
  };
};

const readError = async (response: Response): Promise<string> => {
  try {
    const body = await response.json() as { error?: string; message?: string };
    return body.error || body.message || `Request failed (${response.status}).`;
  } catch {
    return `Request failed (${response.status}).`;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        localStorage.removeItem('user');
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!response.ok) {
          throw new Error('Your session has expired. Please sign in again.');
        }

        const userData = parseUser(await response.json() as AuthResponse);
        if (isMounted) {
          setToken(storedToken);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
        if (error instanceof TypeError) {
          console.error('Unable to validate the saved HostelAI session because the API is unavailable.', error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      let response: Response;
      try {
        response = await fetch(`${apiBaseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });
      } catch (error) {
        throw new Error('Unable to connect to the HostelAI API. Make sure the backend is running.', { cause: error });
      }

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data = await response.json() as AuthResponse;
      if (!data.token) {
        throw new Error('The server did not return an authentication token.');
      }

      const userData = parseUser(data);
      setToken(data.token);
      setUser(userData);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      let response: Response;
      try {
        response = await fetch(`${apiBaseUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email: email.trim().toLowerCase(), password }),
        });
      } catch (error) {
        throw new Error('Unable to connect to the HostelAI API. Make sure the backend is running.', { cause: error });
      }

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await login(email, password);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
