import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Bell,
  Activity,
  Search,
  Home
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

import { LeadsRepository } from "@/repositories/leads-repository";
import { formatDistanceToNow } from "date-fns";

import { ThemeToggle } from "@/components/theme-toggle";
import { AdminMobileSidebar } from "@/components/admin/admin-mobile-sidebar";

export const metadata = {
  title: "Admin Portal | Regulatory Platform",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const recentLeads = await LeadsRepository.getLeads({ limit: 5, status: 'New' });
  
  if (!user) {
    redirect("/login");
  }

  if (!user.roles.includes("ADMIN")) {
    // Prevent infinite redirect loop for authenticated non-admin users
    redirect("/");
  }

  // Fetch recent notifications for this admin
  let recentNotifications: any[] = [];
  try {
    const { db } = await import("@/db");
    const { notifications } = await import("@/db/schema");
    const { eq, desc } = await import("drizzle-orm");
    recentNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(5);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
  }

  const initials = user.firstName ? user.firstName.charAt(0) : (user.email ? user.email.charAt(0) : "AD");

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 border-r border-transparent dark:border-slate-800 text-slate-300 hidden lg:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <ShieldCheck size={24} className="text-orange-500 mr-3" />
          <Link href="/" className="text-xl font-bold text-white tracking-tight hover:text-orange-400 transition-colors">
            <span className="hidden lg:inline">LegalNorms Consultations</span>
            <span className="lg:hidden">LN Consultations</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            <Link href="/admin" className="flex items-center px-3 py-2.5 rounded-lg text-white bg-slate-800 font-medium">
              <LayoutDashboard size={20} className="mr-3 text-orange-500" />
              Dashboard
            </Link>
            
            <div className="pt-4 pb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Operations
            </div>
            <Link href="/admin/dashboard" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <Activity size={20} className="mr-3" />
              Client Dashboard
            </Link>
            <Link href="/admin/intelligence" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <ShieldCheck size={20} className="mr-3" />
              Intelligence
            </Link>
            <Link href="/admin/search" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <Search size={20} className="mr-3" />
              Search
            </Link>
            <Link href="/admin/leads" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <Users size={20} className="mr-3" />
              User Query Info
            </Link>
            <Link href="/admin/projects" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <ShieldCheck size={20} className="mr-3" />
              Client Projects
            </Link>
            
            <Link href="/admin/team" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <Users size={20} className="mr-3" />
              Team Management
            </Link>
            <Link href="/admin/messages" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <Activity size={20} className="mr-3" />
              Msg Checklist
            </Link>

            <div className="pt-4 pb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Client Tools
            </div>
            <Link href="/admin/dashboard/portfolio" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <ShieldCheck size={20} className="mr-3" />
              Portfolio
            </Link>

            <Link href="/admin/dashboard/manufacturers" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <Users size={20} className="mr-3" />
              Manufacturers
            </Link>
            <Link href="/admin/dashboard/alerts" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <Bell size={20} className="mr-3" />
              Regulatory Alerts
            </Link>
            <Link href="/admin/dashboard/documents" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <FileText size={20} className="mr-3" />
              My Documents
            </Link>
            <Link href="/admin/dashboard/research" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <Search size={20} className="mr-3" />
              Research
            </Link>
            <Link href="/admin/dashboard/import-compliance" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <ShieldCheck size={20} className="mr-3" />
              Import Compliance
            </Link>
            <Link href="/admin/dashboard/regulatory-library" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <FileText size={20} className="mr-3" />
              Regulatory Library
            </Link>
            
            <div className="pt-4 pb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              CMS
            </div>
            <Link href="/admin/content" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <FileText size={20} className="mr-3" />
              Page Content
            </Link>
            <Link href="/admin/legal" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <ShieldCheck size={20} className="mr-3" />
              Legal Pages
            </Link>
            <Link href="/admin/brands" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <FileText size={20} className="mr-3" />
              Trusted Brands
            </Link>
            <Link href="/admin/testimonials" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <FileText size={20} className="mr-3" />
              Client Testimonials
            </Link>
            <Link href="/admin/locations" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <FileText size={20} className="mr-3" />
              Company Locations
            </Link>
            <Link href="/admin/services" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <FileText size={20} className="mr-3" />
              Service Catalogue
            </Link>
            <Link href="/admin/articles" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium">
              <FileText size={20} className="mr-3" />
              Knowledge Base
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link href="/admin/settings" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium text-sm">
            <Settings size={18} className="mr-3" />
            Settings
          </Link>
          <button className="w-full flex items-center px-3 py-2.5 rounded-lg hover:bg-red-900/50 hover:text-red-400 transition font-medium text-sm mt-1">
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <AdminMobileSidebar />
            <h1 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 truncate">Admin Operations</h1>
          </div>
          <div className="flex items-center space-x-3 lg:space-x-6">
            <Link 
              href="/" 
              className="text-slate-400 hover:text-orange-600 transition relative p-2"
              title="Return to Home Page"
            >
              <Home size={24} />
            </Link>
            <ThemeToggle />
            
            <div className="relative group">
              <button className="text-slate-400 hover:text-orange-600 transition relative py-2">
                <Bell size={24} />
                {recentNotifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-1 right-[-4px] w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[9px] font-bold text-white flex items-center justify-center">
                    {recentNotifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center">
                  <span>Notifications</span>
                  {recentNotifications.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{recentNotifications.filter(n => !n.isRead).length} New</span>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {recentNotifications.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {recentNotifications.map(notification => (
                        <div key={notification.id} className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{notification.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-[10px] text-orange-500 font-medium mt-2 flex items-center gap-1">
                            {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                      No new notifications
                    </div>
                  )}
                </div>
                <Link href="/admin/messages" className="block text-center text-xs font-bold text-orange-600 dark:text-orange-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition border-t border-slate-200 dark:border-slate-700">
                  View Msg Checklist
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-6">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Admin Profile" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold uppercase">
                  {initials}
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : "System Admin"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || "admin@legalnormsconsultations.com"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950/50 p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
