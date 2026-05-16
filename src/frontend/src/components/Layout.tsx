import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ImageIcon,
  LayoutGrid,
  LogIn,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isInitializing, isLoggingIn, login, clear } =
    useInternetIdentity();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleAuth = () => {
    if (isAuthenticated) {
      clear();
      queryClient.clear();
    } else {
      login();
    }
  };

  const navLink = (to: string, label: string, icon: ReactNode) => {
    const active =
      currentPath === to || (to !== "/" && currentPath.startsWith(to));
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors ${
          active
            ? "text-primary border-b border-primary pb-0.5"
            : "text-muted-foreground hover:text-foreground"
        }`}
        data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}_link`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-card border-b border-border shadow-frame"
        data-ocid="layout.header"
      >
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.brand_link"
          >
            <div className="w-7 h-7 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-display font-bold text-sm uppercase tracking-[0.2em] text-foreground">
              Artifact
            </span>
          </Link>

          {/* Nav */}
          <nav
            className="hidden sm:flex items-center gap-6"
            data-ocid="layout.nav"
          >
            {navLink("/", "Explore", <LayoutGrid className="h-3.5 w-3.5" />)}
            {isAuthenticated &&
              navLink("/my-nfts", "My NFTs", <User className="h-3.5 w-3.5" />)}
            {isAuthenticated &&
              navLink("/mint", "Mint", <Sparkles className="h-3.5 w-3.5" />)}
          </nav>

          {/* Auth */}
          <Button
            onClick={handleAuth}
            disabled={isInitializing || isLoggingIn}
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
            className="shrink-0 font-mono text-xs uppercase tracking-wider"
            data-ocid="layout.auth_button"
          >
            {isInitializing ? (
              "Loading..."
            ) : isAuthenticated ? (
              <>
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
              </>
            ) : (
              <>
                <LogIn className="mr-1.5 h-3.5 w-3.5" /> Login
              </>
            )}
          </Button>
        </div>

        {/* Mobile nav */}
        {isAuthenticated && (
          <div className="sm:hidden border-t border-border flex items-center gap-4 px-4 py-2">
            {navLink("/my-nfts", "My NFTs", <User className="h-3.5 w-3.5" />)}
            {navLink("/mint", "Mint", <Sparkles className="h-3.5 w-3.5" />)}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="bg-card border-t border-border"
        data-ocid="layout.footer"
      >
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <Separator className="mb-6 opacity-30" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
                <ImageIcon className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Artifact
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              &copy; {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
