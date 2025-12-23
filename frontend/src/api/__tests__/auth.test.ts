import axios from 'axios';
import * as auth from '../auth';

jest.mock('axios');
// Provide a manual mock for axiosClient to avoid accessing interceptors during tests
jest.mock('../axiosClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxiosClient = require('../axiosClient').default as jest.Mocked<any>;

describe('auth API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('returns tokens and user on success', async () => {
      const tokens = { access: 'acc', refresh: 'ref', user: { id: 1, email: 'a@a.com' } };
      // axios.post should return a response-like object
      mockedAxios.post.mockResolvedValueOnce({ status: 200, data: tokens });

      // When user not included, axiosClient.get will be used — mock to return user
      mockedAxiosClient.get.mockResolvedValueOnce(tokens.user);

      const res = await auth.login({ email: 'a@a.com', password: 'password' });
      expect(res.access).toBe('acc');
      expect(res.refresh).toBe('ref');
      expect(res.user).toEqual(tokens.user);
    });

    it('throws backend message on 400', async () => {
      mockedAxios.post.mockResolvedValueOnce({ status: 400, data: { detail: 'Please verify' } });
      await expect(auth.login({ email: 'a@a.com', password: 'pw' })).rejects.toThrow('Please verify');
    });
  });

  describe('register', () => {
    it('returns message and user when backend provides both', async () => {
      const resp = { message: 'ok', user: { id: 2, email: 'b@b.com' } };
      mockedAxiosClient.post.mockResolvedValueOnce(resp as any);

      const result = await auth.register({
        email: 'b@b.com',
        phone_number: '',
        first_name: 'B',
        last_name: 'B',
        password: 'pw',
        confirm_password: 'pw'
      } as any);

      expect(result.message).toBe('ok');
      expect(result.user).toEqual(resp.user);
    });

    it('returns message and null user when backend provides only message', async () => {
      const resp = { message: 'verify your email' };
      mockedAxiosClient.post.mockResolvedValueOnce(resp as any);

      const result = await auth.register({
        email: 'c@c.com',
        phone_number: '',
        first_name: 'C',
        last_name: 'C',
        password: 'pw',
        confirm_password: 'pw'
      } as any);

      expect(result.message).toBe('verify your email');
      expect(result.user).toBeNull();
    });

    it('fetches user if tokens are returned', async () => {
      const resp = { access: 'acc', refresh: 'ref' };
      const user = { id: 3, email: 'd@d.com' };
      mockedAxiosClient.post.mockResolvedValueOnce(resp as any);
      mockedAxiosClient.get.mockResolvedValueOnce(user as any);

      const result = await auth.register({
        email: 'd@d.com',
        phone_number: '',
        first_name: 'D',
        last_name: 'D',
        password: 'pw',
        confirm_password: 'pw'
      } as any);

      expect(result.message).toBe('Registration successful.');
      expect(result.user).toEqual(user);
    });

    it('treats empty-success response as successful registration', async () => {
      // Some backends return 201/204 with empty body; ensure we handle that
      mockedAxiosClient.post.mockResolvedValueOnce({} as any);

      const result = await auth.register({
        email: 'e@e.com',
        phone_number: '',
        first_name: 'E',
        last_name: 'E',
        password: 'pw',
        confirm_password: 'pw'
      } as any);

      expect(result.message).toMatch(/Registration successful/i);
      expect(result.user).toBeNull();
    });
  });
});
