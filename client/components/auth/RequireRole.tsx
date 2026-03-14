"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function RequireRole({
  roles,
  children,
}: {
  roles: Array<"staff" | "secretariat" | "case_manager" | "admin">;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) router.replace("/login");
    else if (!roles.includes(user.role)) router.replace("/dashboard");
  }, [user, router, roles]);

  if (!user) return null;
  if (!roles.includes(user.role)) return null;
  return <>{children}</>;
}

