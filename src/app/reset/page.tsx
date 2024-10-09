"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token')
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
//eslint-disable-next-line
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      const url = "/api/auth/forget";
      const reqdata = JSON.stringify({ token, password });
      const response = await axios.post(url, reqdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (response.status === 200) {
       router.push('/login')
      } else {
        setErrorMessage(data.message || "Something went wrong.");
      }
    } 
    //eslint-disable-next-line
    catch (error: any) {
      if (error.response) {
        // Handle API error response
        console.error("API request error:", error.response.data);
        setErrorMessage(
          `API request failed: ${error.response.data.message || "An error occurred"}`
        );
      } else {
        // Handle unexpected errors
        console.error("Error preparing request:", error.message);
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
