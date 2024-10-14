// src/app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import  AuthContext  from '@/context/AuthContext';
import { useContext } from 'react';

export default function Home() {
  const { user, logout } =  useContext(AuthContext);
  const router = useRouter();

  const handleSubscribe = async () => {
    try {
      router.push('https://buy.stripe.com/test_fZe4hZfpBbKCbo45kk');
    } 
    //eslint-disable-next-line
    catch (error: any) {
      console.error('Subscribe error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-6">
        <h1 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white">Welcome, {user?.fullName}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Subscribe to our service to get exclusive content and features.
        </p>
        {!user?.subscription ? (
          <button
            onClick={handleSubscribe}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Subscribe Now
          </button>
        ) : (
          <p className="text-green-600">You are already subscribed!</p>
        )}
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
