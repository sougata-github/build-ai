export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center fixed inset-0 bg-background">
      {children}
    </div>
  );
}
