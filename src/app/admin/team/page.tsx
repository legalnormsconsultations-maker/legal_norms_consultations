import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRoleToggle } from "./user-role-toggle";
import { UserActionsMenu } from "./user-actions";
import { ShieldCheck, User } from "lucide-react";

export const metadata = {
  title: "Team Management | Admin Portal",
};

export default async function TeamPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  
  const isSuperAdmin = currentUser.roles.includes("SUPER_ADMIN");

  const allUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Team & User Management</h1>
          <p className="text-slate-500 mt-1">Manage admin access and user roles.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-center">Admin Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {allUsers.map((u) => {
              const uRoles = Array.isArray(u.roles) ? u.roles.filter(r => typeof r === "string") : ["USER"];
              // Always treat owner email as admin and super admin in UI
              if (u.email === "legalnormsconsultations@gmail.com") {
                if (!uRoles.includes("ADMIN")) uRoles.push("ADMIN");
                if (!uRoles.includes("SUPER_ADMIN")) uRoles.push("SUPER_ADMIN");
              }
              const isUserAdmin = uRoles.includes("ADMIN");
              const isOwner = u.email === "legalnormsconsultations@gmail.com";
              const date = new Date(u.createdAt).toLocaleDateString();

              return (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                        {u.firstName ? u.firstName.charAt(0) : <User size={18} />}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{u.firstName ? `${u.firstName} ${u.lastName || ''}` : "Unknown"}</p>
                      {isOwner && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-white bg-amber-500 dark:bg-amber-600 px-2 py-0.5 rounded-full mt-1">
                          <ShieldCheck size={10} /> Owner
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{u.email}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{date}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <UserRoleToggle 
                        userId={u.id} 
                        isAdmin={isUserAdmin} 
                        isOwner={isOwner} 
                        canEdit={isSuperAdmin && !isOwner}
                      />
                      <UserActionsMenu
                        user={u}
                        canEdit={isSuperAdmin && !isOwner && u.id !== currentUser.id}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
