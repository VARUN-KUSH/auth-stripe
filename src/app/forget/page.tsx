// src/app/forget.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

const ForgetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setMessage(data.message || 'Reset link sent to your email.');
        setErrorMessage('');
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Redirect after 2 seconds
      } else {
        setErrorMessage(data.message || 'Failed to send reset link.');
      }
    } 
    //eslint-disable-next-line
    catch (error: any) {
      console.error('Forget password error:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Enter your email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white bg-black hover:bg-neutral-950 rounded-md p-2 hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;
