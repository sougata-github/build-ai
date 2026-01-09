import { ShieldAlertIcon } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export const UnauthenticatedView = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 bg-background">
      <div className="w-full max-w-lg">
        <Item variant="outline" className="rounded-xl">
          <ItemMedia variant="icon">
            <ShieldAlertIcon />
          </ItemMedia>

          <ItemContent>
            <ItemTitle>Unauthorized Access</ItemTitle>
            <ItemDescription>
              You are not authorized to access this resource.
            </ItemDescription>
          </ItemContent>

          <ItemActions>
            <SignInButton>
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </SignInButton>
          </ItemActions>
        </Item>
      </div>
    </div>
  );
};
