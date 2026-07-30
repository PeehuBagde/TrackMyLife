function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-ink-950 relative overflow-hidden">

      {/* Soft lamplight glow, top of the page */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #E3993B 0%, transparent 65%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-14">
        {children}
      </div>

    </div>
  );
}

export default DashboardLayout;