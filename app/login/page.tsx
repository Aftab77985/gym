import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export default async function LoginPage() {
  // Use await with cookies() for your Next.js version
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log('LoginPage: token from cookie:', token);
  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      console.log('LoginPage: JWT is valid, redirecting to /dashboard');
      redirect('/dashboard');
    } catch (err) {
      console.log('LoginPage: JWT verification failed:', err);
      // Invalid token, continue to render login
    }
  } else {
    console.log('LoginPage: No token found, rendering login form');
  }
  // Render the login form (client component)
  return <LoginForm />;
} 