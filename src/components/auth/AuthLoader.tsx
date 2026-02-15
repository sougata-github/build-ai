import { Spinner } from "../ui/spinner";

export const AuthLoader = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 bg-background z-50">
      <Spinner className="size-6" />
    </div>
  );
};
