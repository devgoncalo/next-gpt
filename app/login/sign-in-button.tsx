"use client";

import { Github, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SignInButton() {
  const { signInWithGithub, user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true)
    await signInWithGithub();
  }
  
  const router = useRouter();
  // Check if there is a user
  useEffect(() => {
    if (user) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleSignIn}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Github className="mr-2 h-4 w-4" />
      )}
      Sign in with Github
    </Button>
  );
}
