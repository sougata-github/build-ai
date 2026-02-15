import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const UnauthenticatedView = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Build <span className="font-mono">AI</span>
          </CardTitle>
          <CardDescription>Start building your next project.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton mode="modal">
            <Button className="w-full" size="lg">
              <LogInIcon className="size-4" />
              Sign in to continue
            </Button>
          </SignInButton>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account? Signing in will create one.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
