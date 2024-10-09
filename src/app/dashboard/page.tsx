// pages/index.js or app/page.js
'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    // This case is handled by middleware, but added as a fallback
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800">
        {/* Card Image */}
        <img
          className="w-full"
          src="https://source.unsplash.com/random/400x200" // Replace with your image URL
          alt="Card Image"
        />

        <div className="px-6 py-4">
          {/* Card Title */}
          <div className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
            Welcome, {user.email}
          </div>
          
          {/* Card Description */}
          <p className="text-gray-700 dark:text-gray-300 text-base">
            Get access to exclusive content, updates, and special offers by subscribing to our service. Don't miss out!
          </p>
        </div>

        <div className="px-6 pt-4 pb-4 flex justify-between">
          {/* Subscribe Button */}
          <a 
            href="https://buy.stripe.com/test_fZe4hZfpBbKCbo45kk" 
            className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Subscribe
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
