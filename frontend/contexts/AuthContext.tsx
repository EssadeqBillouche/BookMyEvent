/**
 * Authentication Context
 * 
 * Global state management for user authentication using React Context API.
 * Provides authentication state and methods throughout the application.
 * Implements HTTP-only cookie-based authentication.
 * 
 * @module AuthContext
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

/**
 * User Interface
 * 
 * Defines the shape of authenticated user data.
 * Matches the user object returned from backend authentication endpoints.
 */
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

/**
 * Auth Context Type
 * 
 * Defines the shape of the authentication context value.
 * Provides user state and authentication methods.
 */
interface AuthContextType {
  user: User | null;           // Current authenticated user or null
  loading: boolean;             // Initial authentication check in progress
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  getRedirectPath: (user: User | null) => string;  // Get appropriate redirect based on role
}

/**
 * Authentication Context
 * 
 * React context for sharing authentication state across components.
 * Should be accessed via useAuth() hook, not directly.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * 
 * Wraps application to provide authentication state and methods.
 * Automatically checks authentication status on mount.
 * 
 * @param children - Child components to be wrapped
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initial Authentication Check
   * 
   * Runs on component mount to verify if user has valid session.
   * Cookie is automatically sent with request by browser.
   * 
   * If valid cookie exists:
   * - Backend validates JWT and returns user data
   * - User state is populated
   * 
   * If no cookie or invalid:
   * - Request fails with 401
   * - User remains null
   */
  useEffect(() => {
    authAPI
      .getCurrentUser()
      .then((userData) => setUser(userData))
      .catch(() => {
        // No valid session found - user remains null
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Login User
   * 
   * Authenticates user with email and password.
   * Backend sets HTTP-only cookie on successful login.
   * 
   * @param email - User email address
   * @param password - User password (sent securely over HTTPS)
   * 
   * @returns The authenticated user
   * @throws {Error} If credentials are invalid
   * 
   * Side Effects:
   * - Updates user state on success
   * - HTTP-only cookie is set by backend
   */
  const login = async (email: string, password: string): Promise<User> => {
    const response = await authAPI.login({ email, password });
    setUser(response.user);
    return response.user;
  };

  /**
   * Register New User
   * 
   * Creates new account and automatically logs in.
   * Backend sets HTTP-only cookie on successful registration.
   * 
   * @param data - User registration information
   * 
   * @returns The newly created user
   * @throws {Error} If registration fails (e.g., email already exists)
   * 
   * Side Effects:
   * - Creates user in database
   * - Updates user state on success
   * - HTTP-only cookie is set by backend
   */
  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  }): Promise<User> => {
    const response = await authAPI.register(data);
    setUser(response.user);
    return response.user;
  };

  /**
   * Logout User
   * 
   * Terminates user session by clearing authentication cookie.
   * Must call backend to properly remove HTTP-only cookie.
   * 
   * @async
   * 
   * Side Effects:
   * - Clears user state
   * - Backend clears HTTP-only cookie
   * - User must login again to access protected routes
   */
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  /**
   * Get Redirect Path Based on User Role
   * 
   * Returns the appropriate dashboard path based on user role.
   * Admins are redirected to admin dashboard, participants to regular dashboard.
   * 
   * @param targetUser - User to check role for (can be null)
   * @returns Appropriate redirect path
   */
  const getRedirectPath = (targetUser: User | null): string => {
    if (!targetUser) return '/login';
    return targetUser.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Must be used within AuthProvider component tree.
 * 
 * @returns Authentication context value
 * 
 * @throws {Error} If used outside AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, login, logout } = useAuth();
 * 
 * if (user) {
 *   // User is authenticated
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
