"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Forget = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    } catch (error: any) {
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
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Forget;
