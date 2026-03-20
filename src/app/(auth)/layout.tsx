export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      {/* Subtle amber gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/3 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
