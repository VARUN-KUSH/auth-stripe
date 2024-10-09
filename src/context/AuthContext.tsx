// context/AuthContext.js
"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import axios from "axios";

const AuthContext = createContext({
  user: {email:''},
  loading: false,
  //eslint-disable-next-line
  login: (userData:any) => {}, // Define your login function
  logout: async () => {}, // Define your logout function
})
//eslint-disable-next-line
export function AuthProvider({ children }: { children: any }): JSX.Element {
  const [user, setUser] = useState({email:''});
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/currentUser");
        setUser(res.data.user);
      } catch (err) {
        setUser({email:''});
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
//eslint-disable-next-line
  const login = (userData:any) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser({email:''});
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
