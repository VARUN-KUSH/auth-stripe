import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
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
        Subscribe to our service
      </div>
      
      {/* Card Description */}
      <p className="text-gray-700 dark:text-gray-300 text-base">
        Get access to exclusive content, updates, and special offers by subscribing to our service. Don't miss out!
      </p>
    </div>

    <div className="px-6 pt-4 pb-4">
      {/* Subscribe Button */}

        <a href="https://buy.stripe.com/test_fZe4hZfpBbKCbo45kk"   className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
          Subscribe to this
        </a>

    </div>
  </div>
  );
}
