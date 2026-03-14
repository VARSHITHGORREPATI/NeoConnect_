import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "../components/auth/AuthProvider";

export const metadata = {
  title: "NeoConnect",
  description: "Staff feedback and complaint management platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

