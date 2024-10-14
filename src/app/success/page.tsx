// src/app/success.tsx
'use client';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '@/context/AuthContext';

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
   //eslint-disable-next-line
  const { user, setUser } = useContext(AuthContext); // Assuming setUser is available

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (response.status === 200 && data.user) {
          setUser(data.user); // Update context with latest user data
          setLoading(false);
        } else {
          setError('Failed to retrieve user information.');
          setLoading(false);
        }
      } 
       //eslint-disable-next-line
      catch (err: any) {
        console.error('Error fetching user data:', err);
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    };

    if (session_id) {
      fetchUser();
    } else {
      setError('Invalid session.');
      setLoading(false);
    }
  }, [session_id, setUser]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Thank you for subscribing. Your subscription is now active.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
