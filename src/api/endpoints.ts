export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  complaints: {
    list: '/complaints',
    mine: '/complaints/mine',
    nearby: '/complaints/nearby',
    create: '/complaints',
    byId: (id: string) => `/complaints/${id}`,
    upload: '/complaints/upload',
  },
} as const;
