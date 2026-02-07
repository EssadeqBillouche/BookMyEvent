import axios from 'axios';
import { api, authAPI, eventAPI, registrationAPI } from '@/lib/api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

describe('API Configuration', () => {
  it('creates axios instance with correct baseURL', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
      })
    );
  });

  it('enables credentials for cookie-based auth', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        withCredentials: true,
      })
    );
  });

  it('sets JSON content type header', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });
});

describe('authAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('calls POST /auth/register with user data', async () => {
      const mockResponse = { data: { user: { id: '1', email: 'test@test.com' } } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authAPI.register({
        email: 'test@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('login', () => {
    it('calls POST /auth/login with credentials', async () => {
      const mockResponse = { data: { user: { id: '1', email: 'test@test.com' } } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authAPI.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      const mockResponse = { data: { message: 'Logged out' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await authAPI.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('getCurrentUser', () => {
    it('calls GET /auth/me', async () => {
      const mockResponse = { data: { id: '1', email: 'test@test.com' } };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authAPI.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });
  });
});

describe('eventAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('calls GET /events', async () => {
      const mockEvents = { data: [{ id: '1', title: 'Test Event' }] };
      (api.get as jest.Mock).mockResolvedValue(mockEvents);

      const result = await eventAPI.getAll();

      expect(api.get).toHaveBeenCalledWith('/events');
      expect(result).toEqual(mockEvents.data);
    });
  });

  describe('getAllAdmin', () => {
    it('calls GET /events/admin', async () => {
      const mockEvents = { data: [{ id: '1', title: 'Test Event', status: 'draft' }] };
      (api.get as jest.Mock).mockResolvedValue(mockEvents);

      const result = await eventAPI.getAllAdmin();

      expect(api.get).toHaveBeenCalledWith('/events/admin');
      expect(result).toEqual(mockEvents.data);
    });
  });

  describe('getById', () => {
    it('calls GET /events/:id', async () => {
      const mockEvent = { data: { id: '1', title: 'Test Event' } };
      (api.get as jest.Mock).mockResolvedValue(mockEvent);

      const result = await eventAPI.getById('1');

      expect(api.get).toHaveBeenCalledWith('/events/1');
      expect(result).toEqual(mockEvent.data);
    });
  });

  describe('create', () => {
    it('calls POST /events with event data', async () => {
      const eventData = {
        title: 'New Event',
        description: 'Description',
        startDate: '2025-01-01T10:00:00',
        endDate: '2025-01-01T12:00:00',
        location: 'Test Location',
        capacity: 100,
      };
      const mockResponse = { data: { id: '1', ...eventData } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await eventAPI.create(eventData);

      expect(api.post).toHaveBeenCalledWith('/events', eventData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('update', () => {
    it('calls PATCH /events/:id with update data', async () => {
      const updateData = { title: 'Updated Title' };
      const mockResponse = { data: { id: '1', title: 'Updated Title' } };
      (api.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await eventAPI.update('1', updateData);

      expect(api.patch).toHaveBeenCalledWith('/events/1', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('publish', () => {
    it('calls PATCH /events/:id/publish', async () => {
      const mockResponse = { data: { id: '1', status: 'published' } };
      (api.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await eventAPI.publish('1');

      expect(api.patch).toHaveBeenCalledWith('/events/1/publish');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('delete', () => {
    it('calls DELETE /events/:id', async () => {
      (api.delete as jest.Mock).mockResolvedValue({});

      await eventAPI.delete('1');

      expect(api.delete).toHaveBeenCalledWith('/events/1');
    });
  });
});

describe('registrationAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('calls POST /registrations with event ID', async () => {
      const mockResponse = { data: { id: '1', eventId: 'event-1', status: 'pending' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await registrationAPI.register({ eventId: 'event-1' });

      expect(api.post).toHaveBeenCalledWith('/registrations', { eventId: 'event-1' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('checkRegistration', () => {
    it('calls GET /registrations/check/:eventId', async () => {
      const mockResponse = { data: { isRegistered: true } };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await registrationAPI.checkRegistration('event-1');

      expect(api.get).toHaveBeenCalledWith('/registrations/check/event-1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getMyRegistrations', () => {
    it('calls GET /registrations/my', async () => {
      const mockResponse = { data: [{ id: '1', eventId: 'event-1' }] };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await registrationAPI.getMyRegistrations();

      expect(api.get).toHaveBeenCalledWith('/registrations/my');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('cancel', () => {
    it('calls PATCH /registrations/:id/cancel', async () => {
      const mockResponse = { data: { id: '1', status: 'cancelled' } };
      (api.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await registrationAPI.cancel('1');

      expect(api.patch).toHaveBeenCalledWith('/registrations/1/cancel');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
