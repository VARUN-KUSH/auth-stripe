// app/layout.js
"use client";

import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";


export default function RootLayout({
  children,
}: {
  //eslint-disable-next-line
  children: any;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
