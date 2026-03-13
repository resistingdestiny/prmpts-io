"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [expired, setExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // The auth callback already exchanged the code and set the session cookie.
    // We just need to verify there's an active session.
    // Also listen for auth events in case the session is still being established.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
          setReady(true);
        }
      }
    );

    // Check for existing session (set by /auth/callback redirect)
    supabase.auth.getUser().then(({ data: { user }, error: err }) => {
      if (user) {
        setReady(true);
      } else if (err) {
        // No session and no recovery event — link is invalid or expired
        setExpired(true);
      }
    });

    // Fallback: if nothing happens after 5 seconds, show expired state
    const timeout = setTimeout(() => {
      setReady((current) => {
        if (!current) setExpired(true);
        return current;
      });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Card className="w-full max-w-sm p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Password updated</h1>
        <p className="mb-4 text-sm text-muted">
          Your password has been reset successfully.
        </p>
        <Button onClick={() => router.push("/explore")} className="w-full">
          Continue to prmpts
        </Button>
      </Card>
    );
  }

  if (expired) {
    return (
      <Card className="w-full max-w-sm p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Link expired</h1>
        <p className="mb-4 text-sm text-muted">
          This reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full">Request new link</Button>
        </Link>
      </Card>
    );
  }

  if (!ready) {
    return (
      <Card className="w-full max-w-sm p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Verifying reset link</h1>
        <p className="text-sm text-muted">Please wait...</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm p-6">
      <h1 className="mb-1 text-xl font-bold">Choose new password</h1>
      <p className="mb-6 text-sm text-muted">
        Enter your new password below
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="password"
          placeholder="New password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={6}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        <Link href="/login" className="text-foreground hover:underline">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
