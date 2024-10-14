// src/app/cancel.tsx
'use client';
import { useRouter } from 'next/navigation';

const CancelPage = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your payment was cancelled. You can try subscribing again or contact support for assistance.
        </p>
        <button
          onClick={handleRetry}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Retry Subscription
        </button>
      </div>
    </div>
  );
};

export default CancelPage;
