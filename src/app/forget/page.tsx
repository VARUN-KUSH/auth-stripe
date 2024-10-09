"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Forget = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
//eslint-disable-next-line
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      const url = "/api/auth/forget";
      const response = await axios.post(url, { email }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (response.status === 200) {
        setMessage(data.message || "Reset link sent to your email.");
        setErrorMessage(""); // Clear any previous error message
        router.push("/login");
      } else {
        setErrorMessage(data.message || "Something went wrong.");
      }
    } 
    //eslint-disable-next-line
    catch (error: any) {
      if (error.response) {
        // Handle API error response
        console.error("API request error:", error.response.data);
        setErrorMessage(`API request failed: ${error.response.data.message || 'An error occurred'}`);
      } else {
        // Handle unexpected errors
        console.error("Error preparing request:", error.message);
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Forget;
