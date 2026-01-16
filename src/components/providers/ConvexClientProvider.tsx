"use client";

import { AuthLoading, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { AuthLoader } from "../auth/AuthLoader";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {/* Always render children - middleware handles route protection */}
      <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>

      {/* Show loader while auth state is being determined */}
      <AuthLoading>
        <AuthLoader />
      </AuthLoading>
    </ConvexProviderWithClerk>
  );
}
