function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">

      <div className="max-w-7xl mx-auto p-8">

        {children}

      </div>

    </div>
  );
}

export default DashboardLayout;