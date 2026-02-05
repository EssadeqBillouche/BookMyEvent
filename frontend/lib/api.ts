/**
 * API Client Configuration
 * 
 * Centralized Axios instance and API methods for communicating with the backend.
 * Implements HTTP-only cookie authentication for secure token management.
 * 
 * @module api
 */

import axios from 'axios';

/**
 * Base API URL
 * Falls back to localhost:4000 if environment variable is not set.
 * Should be configured via NEXT_PUBLIC_API_URL in production.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Axios Instance
 * 
 * Configured with:
 * - baseURL: Backend API endpoint
 * - withCredentials: Required for sending/receiving HTTP-only cookies
 * - headers: Default content type for JSON requests
 * 
 * @constant
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Critical: Enables cookie-based authentication
});

/**
 * Authentication API Methods
 * 
 * Collection of methods for user authentication operations.
 * All methods use HTTP-only cookies for token storage (no localStorage).
 */
export const authAPI = {
  /**
   * Register New User
   * 
   * Creates a new user account. Backend sets HTTP-only cookie with JWT token.
   * 
   * @param data - User registration details
   * @returns Promise with user data (token is in cookie, not response)
   * 
   * @throws {AxiosError} If registration fails (e.g., email already exists)
   */
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role?: 'admin' | 'participant';
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * User Login
   * 
   * Authenticates user credentials. Backend sets HTTP-only cookie with JWT token.
   * 
   * @param data - Login credentials (email and password)
   * @returns Promise with user data
   * 
   * @throws {AxiosError} If credentials are invalid (401)
   */
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * User Logout
   * 
   * Terminates user session by clearing authentication cookie on server.
   * 
   * @returns Promise with success message
   * 
   * Note: Client-side cookie is removed by backend via Set-Cookie header
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Get User Profile
   * 
   * Fetches complete user profile from database.
   * Requires valid JWT cookie.
   * 
   * @returns Promise with full user profile
   * 
   * @throws {AxiosError} If not authenticated (401)
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Get Current User (Session Check)
   * 
   * Lightweight endpoint that returns JWT payload data.
   * Useful for verifying session validity.
   * 
   * @returns Promise with user data from JWT payload
   * 
   * @throws {AxiosError} If token is invalid or expired (401)
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

/**
 * User Management API Methods
 * 
 * CRUD operations for user management.
 * Requires authentication and appropriate permissions.
 */
export const userAPI = {
  /**
   * Get All Users
   * 
   * Retrieves list of all users.
   * Typically restricted to admin users.
   * 
   * @returns Promise with array of users
   * 
   * @throws {AxiosError} If not authorized (403)
   */
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * Get User By ID
   * 
   * Retrieves a specific user by their unique identifier.
   * 
   * @param id - Unique user identifier
   * @returns Promise with user data
   * 
   * @throws {AxiosError} If user not found (404)
   */
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Update User
   * 
   * Partially updates user data.
   * 
   * @param id - User ID to update
   * @param data - Fields to update (partial user object)
   * @returns Promise with updated user data
   * 
   * @throws {AxiosError} If not authorized or user not found
   */
  update: async (id: string, data: any) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete User
   * 
   * Permanently removes user from database.
   * 
   * @param id - User ID to delete
   * @returns Promise with deletion confirmation
   * 
   * @throws {AxiosError} If not authorized or user not found
   * 
   * @security Typically restricted to admin users or account owner
   */
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

/**
 * Event Types
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  registeredCount: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  imageUrl?: string;
  price: number;
  isFeatured: boolean;
  createdById: string;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  status?: 'draft' | 'published';
  imageUrl?: string;
  price?: number;
  isFeatured?: boolean;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

/**
 * Event Management API Methods
 * 
 * CRUD operations for event management.
 * Admin-only operations require admin role.
 */
export const eventAPI = {
  /**
   * Get All Published Events (Public)
   */
  getAll: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },

  /**
   * Get All Events for Admin (includes drafts, cancelled)
   */
  getAllAdmin: async (): Promise<Event[]> => {
    const response = await api.get('/events/admin');
    return response.data;
  },

  /**
   * Get Upcoming Events (Public)
   */
  getUpcoming: async (limit?: number): Promise<Event[]> => {
    const response = await api.get('/events/upcoming', { params: { limit } });
    return response.data;
  },

  /**
   * Get Featured Events (Public)
   */
  getFeatured: async (): Promise<Event[]> => {
    const response = await api.get('/events/featured');
    return response.data;
  },

  /**
   * Get Single Event by ID (Public for published events)
   */
  getById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  /**
   * Get Single Event by ID for Admin (includes unpublished)
   */
  getByIdAdmin: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}/admin`);
    return response.data;
  },

  /**
   * Create New Event (Admin only)
   */
  create: async (data: CreateEventData): Promise<Event> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  /**
   * Update Event (Admin only)
   */
  update: async (id: string, data: UpdateEventData): Promise<Event> => {
    const response = await api.patch(`/events/${id}`, data);
    return response.data;
  },

  /**
   * Publish Event (Admin only)
   */
  publish: async (id: string): Promise<Event> => {
    const response = await api.patch(`/events/${id}/publish`);
    return response.data;
  },

  /**
   * Cancel Event (Admin only)
   */
  cancel: async (id: string): Promise<Event> => {
    const response = await api.patch(`/events/${id}/cancel`);
    return response.data;
  },

  /**
   * Delete Event (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

/**
 * Registration Types
 */
export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  notes?: string;
  registeredAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  event: Event;
}

export interface CreateRegistrationData {
  eventId: string;
  notes?: string;
}

/**
 * Registration API Methods
 */
export const registrationAPI = {
  /**
   * Register for an event (Authenticated users)
   */
  register: async (data: CreateRegistrationData): Promise<Registration> => {
    const response = await api.post('/registrations', data);
    return response.data;
  },

  /**
   * Get all registrations (Admin only)
   */
  getAll: async (): Promise<Registration[]> => {
    const response = await api.get('/registrations');
    return response.data;
  },

  /**
   * Get registrations for a specific event (Admin only)
   */
  getByEvent: async (eventId: string): Promise<Registration[]> => {
    const response = await api.get(`/registrations/event/${eventId}`);
    return response.data;
  },

  /**
   * Get my registrations
   */
  getMyRegistrations: async (): Promise<Registration[]> => {
    const response = await api.get('/registrations/my');
    return response.data;
  },

  /**
   * Check if user is registered for an event
   */
  checkRegistration: async (eventId: string): Promise<{ isRegistered: boolean }> => {
    const response = await api.get(`/registrations/check/${eventId}`);
    return response.data;
  },

  /**
   * Get event registration statistics (Admin only)
   */
  getEventStats: async (eventId: string): Promise<{
    total: number;
    confirmed: number;
    cancelled: number;
    attended: number;
  }> => {
    const response = await api.get(`/registrations/stats/${eventId}`);
    return response.data;
  },

  /**
   * Cancel my registration
   */
  cancel: async (id: string): Promise<Registration> => {
    const response = await api.patch(`/registrations/${id}/cancel`);
    return response.data;
  },

  /**
   * Delete registration (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/registrations/${id}`);
  },
};
