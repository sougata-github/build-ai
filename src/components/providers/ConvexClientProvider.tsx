"use client";

import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { AuthLoader } from "../auth/AuthLoader";
import { UnauthenticatedView } from "../auth/UnauthenticatedView";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexQueryCacheProvider>
        {/* When logged in */}
        <Authenticated>{children}</Authenticated>

        {/* Unauthenticated */}
        <Unauthenticated>
          <UnauthenticatedView />
        </Unauthenticated>

        {/* Loading */}
        <AuthLoading>
          <AuthLoader />
        </AuthLoading>
      </ConvexQueryCacheProvider>
    </ConvexProviderWithClerk>
  );
}
