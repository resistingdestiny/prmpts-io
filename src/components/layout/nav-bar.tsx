"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Compass, Plus, Library, Menu, X } from "lucide-react";
import { useState } from "react";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function NavBar() {
  const { user, profile, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className={cn("mx-auto flex h-14 items-center justify-between px-4", MAX_WIDTH)}>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            prmpts
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <Link href="/explore">
              <Button variant="ghost" size="sm">
                <Compass className="mr-1.5 h-4 w-4" />
                Explore
              </Button>
            </Link>
            {user && (
              <>
                <Link href="/create/prompt">
                  <Button variant="ghost" size="sm">
                    <Plus className="mr-1.5 h-4 w-4" />
                    Create
                  </Button>
                </Link>
                <Link href="/library">
                  <Button variant="ghost" size="sm">
                    <Library className="mr-1.5 h-4 w-4" />
                    Library
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-surface" />
          ) : user ? (
            <Link href={profile ? `/u/${profile.username}` : "/settings"}>
              <Avatar
                src={profile?.avatar_url}
                name={profile?.display_name}
                size="sm"
              />
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
          )}
        </div>

        <button
          className="cursor-pointer md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/explore" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Compass className="mr-1.5 h-4 w-4" />
                Explore
              </Button>
            </Link>
            {user ? (
              <>
                <Link href="/create/prompt" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Plus className="mr-1.5 h-4 w-4" />
                    Create
                  </Button>
                </Link>
                <Link href="/library" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Library className="mr-1.5 h-4 w-4" />
                    Library
                  </Button>
                </Link>
                <Link
                  href={profile ? `/u/${profile.username}` : "/settings"}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
