import "server-only";
import ".//globals.css";

export const metadata = {
  title: "NextGPT",
  description: "The all-in-one text model interface for developers.",
};

import SupabaseAuthProvider from "@/lib/supabase/supabase-auth-provider";
import SupabaseProvider from "@/lib/supabase/supabase-provider";
import JotaiProvider from "@/components/providers/jotai-provider";

import { ThemeProviderClient } from "@/components/providers/theme-provider";
import { createClient } from "@/lib/supabase/supabase-server";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <JotaiProvider>
            <SupabaseAuthProvider serverSession={session}>
              <ThemeProviderClient>
                {children}
              </ThemeProviderClient>
            </SupabaseAuthProvider>
          </JotaiProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
