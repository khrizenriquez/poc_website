export const initialForm = {
  name: '',
  email: '',
  message: '',
  reference: '',
  quantity: '1',
  consent: false,
  anonymous: false,
};
export function validateForm(values, kind) {
  const errors = {};
  const anonymous = kind === 'etica-y-denuncias' && values.anonymous;
  if (!anonymous && (values.name.trim().length < 2 || values.name.trim().length > 80))
    errors.name = 'name';
  if (
    !anonymous &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.email.length > 160)
  )
    errors.email = 'email';
  const messageLength = values.message.trim().length;
  if (messageLength < 20 || messageLength > 1500) errors.message = 'message';
  if (['pedidos', 'devoluciones'].includes(kind) && !/^P0[1-6]$/.test(values.reference))
    errors.reference = 'reference';
  if (
    kind === 'pedidos' &&
    (!/^\d+$/.test(values.quantity) || Number(values.quantity) < 1 || Number(values.quantity) > 100)
  )
    errors.quantity = 'quantity';
  if (!values.consent) errors.consent = 'consent';
  return errors;
}
