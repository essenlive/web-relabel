import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Re-Label | Connexion',
};

export default function LoginPage() {
  return <LoginForm />;
}
