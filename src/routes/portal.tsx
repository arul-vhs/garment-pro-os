import { createFileRoute, Outlet, useNavigate, useRouterState, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { usePortalAuth } from "@/lib/customer-auth";
import { PortalShell } from "@/components/PortalShell";

export const Route = createFileRoute("/portal")({ component: PortalLayout });

function PortalLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, loading } = usePortalAuth();
  const navigate = useNavigate();
  const isLogin = path === "/portal/login";

  useEffect(() => {
    if (loading) return;
    if (!user && !isLogin) navigate({ to: "/portal/login" });
  }, [user, loading, isLogin, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (path === "/portal") return <Navigate to={user ? "/portal/dashboard" : "/portal/login"} />;

  if (isLogin) return <Outlet />;
  if (!user) return null;

  return (
    <PortalShell>
      <Outlet />
    </PortalShell>
  );
}
