"use client";

import { Button } from "@/components/ui/button";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";

export default function HomePage() {
  const invoke = useMutation(api.backgroundjobs.exampleMutation);

  const handleInvoke = async () => {
    await invoke({ input: "johndoe@example.com" });
  };

  return (
    <div>
      <Button onClick={handleInvoke}>Build AI</Button>
    </div>
  );
}
