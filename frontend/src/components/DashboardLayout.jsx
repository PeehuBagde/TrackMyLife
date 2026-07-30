function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-stone-50 to-orange-50 relative overflow-hidden">

      {/* Soft morning-light glow, top of the page */}
      <div
        className="pointer-events-none absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #E3993B 0%, transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute -top-20 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #2F6F6D 0%, transparent 65%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-14">
        {children}
      </div>

    </div>
  );
}

export default DashboardLayout;