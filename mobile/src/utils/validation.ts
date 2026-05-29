export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPassword = (password: string): boolean => password.length >= 6;

export const isValidPhone = (phone: string): boolean =>
  /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));

export const isValidDescription = (text: string): boolean =>
  text.trim().length >= 10 && text.trim().length <= 500;
