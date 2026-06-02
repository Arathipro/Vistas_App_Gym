import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const DEFAULT_API_URL = Platform.select({
  android: 'http://10.0.2.2:4000',
  ios: 'http://localhost:4000',
  web: 'http://localhost:4000',
  default: 'http://localhost:4000',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;
const TOKEN_KEY = 'session_token';

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: user.id ?? user.id_usuario,
    id_usuario: user.id_usuario ?? user.id,
  };
}

function normalizePerfil(perfil) {
  if (!perfil) return null;
  return {
    ...perfil,
    id: perfil.id ?? perfil.id_usuario,
    id_usuario: perfil.id_usuario ?? perfil.id,
    diasSemana: perfil.diasSemana ?? perfil.dias_semana,
  };
}

export function isProfileComplete(perfil) {
  return Boolean(
    perfil?.edad &&
    perfil?.peso &&
    perfil?.altura &&
    perfil?.genero &&
    perfil?.objetivo &&
    perfil?.nivel
  );
}

export async function getSessionToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setSessionToken(token) {
  if (!token) return;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearSessionToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = options.token ?? await getSessionToken();
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_error) {
    data = null;
  }

  if (!response.ok || data?.ok === false) {
    const message = data?.error || data?.message || `Error HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function registerRequestCode({ nombre, email, password }) {
  return request('/api/auth/register/request-code', {
    method: 'POST',
    body: {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password,
    },
    token: null,
  });
}

export async function registerConfirm({ email, code }) {
  const data = await request('/api/auth/register/confirm', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
      code,
    },
    token: null,
  });

  return {
    ...data,
    user: normalizeUser(data.user),
  };
}

export async function login({ email, password }) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
      password,
    },
    token: null,
  });

  await setSessionToken(data.token);

  return {
    ...data,
    user: normalizeUser(data.user),
  };
}

export async function logout() {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } finally {
    await clearSessionToken();
  }
}

export async function getProfile() {
  const data = await request('/api/auth/profile');
  return normalizePerfil(data.perfil);
}

export async function saveProfile(perfil) {
  const data = await request('/api/auth/profile', {
    method: 'PUT',
    body: perfil,
  });

  return normalizePerfil(data.perfil);
}

export async function requestPasswordResetCode({ email }) {
  return request('/api/auth/password/request-code', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
    },
    token: null,
  });
}

export async function confirmPasswordReset({ email, code, password }) {
  return request('/api/auth/password/confirm', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
      code,
      password,
    },
    token: null,
  });
}

export async function requestEmailChangeCode() {
  return request('/api/auth/email/request-code', {
    method: 'POST',
  });
}

export async function confirmEmailChange({ code, newEmail }) {
  const data = await request('/api/auth/email/confirm', {
    method: 'POST',
    body: {
      code,
      newEmail: newEmail.trim().toLowerCase(),
    },
  });

  await clearSessionToken();
  return data;
}
