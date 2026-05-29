import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, setStoredToken, clearStoredToken } from '@/src/api/client';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import { AuthTokens, LoginPayload, SignupPayload, User } from '@/src/types';

const USERS_KEY = '@nagarsathi_users';
const SESSION_KEY = '@nagarsathi_session';
const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

interface StoredUser extends User {
  passwordHash: string;
}

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const hashPassword = (password: string) => `hash_${password}`;

const getUsers = async (): Promise<StoredUser[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveUsers = async (users: StoredUser[]) =>
  AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

const mockLogin = async (payload: LoginPayload): Promise<{ user: User; tokens: AuthTokens }> => {
  await delay();
  const users = await getUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === payload.email.toLowerCase() && u.passwordHash === hashPassword(payload.password)
  );
  if (!found) throw new Error('Invalid email or password.');
  const { passwordHash: _, ...user } = found;
  const tokens: AuthTokens = { accessToken: `mock_token_${user.id}` };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ user, tokens }));
  return { user, tokens };
};

const mockSignup = async (payload: SignupPayload): Promise<{ user: User; tokens: AuthTokens }> => {
  await delay();
  const users = await getUsers();
  if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  const user: StoredUser = {
    id: `user_${Date.now()}`,
    name: payload.name.trim(),
    email: payload.email.toLowerCase().trim(),
    phone: payload.phone,
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(payload.password),
  };
  users.push(user);
  await saveUsers(users);
  const { passwordHash: _, ...safeUser } = user;
  const tokens: AuthTokens = { accessToken: `mock_token_${user.id}` };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ user: safeUser, tokens }));
  return { user: safeUser, tokens };
};

const mockGetSession = async (): Promise<{ user: User; tokens: AuthTokens } | null> => {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

const mockLogout = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

export const authService = {
  async login(payload: LoginPayload) {
    if (USE_MOCK) {
      const result = await mockLogin(payload);
      await setStoredToken(result.tokens.accessToken);
      return result;
    }
    const { data } = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      API_ENDPOINTS.auth.login,
      payload
    );
    await setStoredToken(data.tokens.accessToken);
    return data;
  },

  async signup(payload: SignupPayload) {
    if (USE_MOCK) {
      const result = await mockSignup(payload);
      await setStoredToken(result.tokens.accessToken);
      return result;
    }
    const { data } = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      API_ENDPOINTS.auth.signup,
      payload
    );
    await setStoredToken(data.tokens.accessToken);
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    if (USE_MOCK) {
      const session = await mockGetSession();
      return session?.user ?? null;
    }
    try {
      const { data } = await apiClient.get<User>(API_ENDPOINTS.auth.me);
      return data;
    } catch {
      return null;
    }
  },

  async restoreSession(): Promise<User | null> {
    if (USE_MOCK) {
      const session = await mockGetSession();
      if (session) {
        await setStoredToken(session.tokens.accessToken);
        return session.user;
      }
      return null;
    }
    return this.getCurrentUser();
  },

  async logout() {
    if (USE_MOCK) {
      await mockLogout();
    } else {
      try {
        await apiClient.post(API_ENDPOINTS.auth.logout);
      } catch {
        // ignore
      }
    }
    await clearStoredToken();
  },
};
