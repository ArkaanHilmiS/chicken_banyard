export interface User {
  id: string;
  email: string;
  username: string;
  whatsapp_number: string;
  created_at: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  capital_address?: string;
}