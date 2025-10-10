"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");

  const invoke = useMutation(api.backgroundjobs.exampleMutation);

  const handleInvoke = async () => {
    await invoke({ input });
  };

  return (
    <div className="flex flex-col max-w-xl gap-2 p-5">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="max-w-sm"
      />
      <Button onClick={handleInvoke} size="sm" className="w-fit">
        Build AI
      </Button>
    </div>
  );
}
