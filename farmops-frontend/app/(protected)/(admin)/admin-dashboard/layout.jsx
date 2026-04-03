import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="h-full w-full grid grid-cols-12">
      {/* Admin Sidebar — visible on md+ */}
      <div className="col-span-2 hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="col-span-12 md:col-span-10 bg-gray-100 md:rounded-tl-4xl px-5 md:px-10 overflow-y-auto">
        {children}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
