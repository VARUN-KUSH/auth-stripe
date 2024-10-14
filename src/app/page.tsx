"use client";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Home() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  console.log(user);
  if (user===null) {
    router.push("/login");
  } else{
    router.push("/dashboard");
  }
}
