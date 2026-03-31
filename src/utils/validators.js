// src/utils/validators.js
export const isRequired = (value) => {
  if (!value && value !== 0) return 'Este campo es requerido';
  if (typeof value === 'string' && !value.trim()) return 'Este campo es requerido';
  return null;
};

export const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailRegex.test(value)) return 'Email inválido';
  return null;
};

export const isPhone = (value) => {
  const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
  if (value && !phoneRegex.test(value)) return 'Teléfono inválido';
  return null;
};

export const minLength = (min) => (value) => {
  if (value && value.length < min) return `Mínimo ${min} caracteres`;
  return null;
};

export const maxLength = (max) => (value) => {
  if (value && value.length > max) return `Máximo ${max} caracteres`;
  return null;
};

export const isNumber = (value) => {
  if (value && isNaN(value)) return 'Debe ser un número';
  return null;
};

export const minValue = (min) => (value) => {
  if (value && value < min) return `Valor mínimo ${min}`;
  return null;
};

export const maxValue = (max) => (value) => {
  if (value && value > max) return `Valor máximo ${max}`;
  return null;
};

export const isUrl = (value) => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (value && !urlRegex.test(value)) return 'URL inválida';
  return null;
};

export const isDate = (value) => {
  if (value && isNaN(Date.parse(value))) return 'Fecha inválida';
  return null;
};

export const isFutureDate = (value) => {
  if (value && new Date(value) <= new Date()) return 'La fecha debe ser futura';
  return null;
};

export const isPastDate = (value) => {
  if (value && new Date(value) >= new Date()) return 'La fecha debe ser pasada';
  return null;
};

export const validatePassword = (value) => {
  if (!value) return 'Contraseña requerida';
  if (value.length < 8) return 'Mínimo 8 caracteres';
  if (!/[A-Z]/.test(value)) return 'Al menos una mayúscula';
  if (!/[a-z]/.test(value)) return 'Al menos una minúscula';
  if (!/[0-9]/.test(value)) return 'Al menos un número';
  if (!/[!@#$%^&*]/.test(value)) return 'Al menos un carácter especial (!@#$%^&*)';
  return null;
};

export const matchField = (fieldName, fieldLabel) => (value, formValues) => {
  if (value !== formValues[fieldName]) return `No coincide con ${fieldLabel}`;
  return null;
};

export const composeValidators = (...validators) => (value, formValues) => {
  for (const validator of validators) {
    const error = validator(value, formValues);
    if (error) return error;
  }
  return null;
};