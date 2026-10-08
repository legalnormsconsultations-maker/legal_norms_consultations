import { LeadsRepository } from "@/repositories/leads-repository";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Mail, Phone, MoreVertical, Building } from "lucide-react";

import { ExportCsvButton, AddManualLeadButton, LeadActionsMenu } from "./client-components";

export const metadata = {
  title: "User Query Info | Admin",
};

export default async function AdminLeadsPage() {
  const leads = await LeadsRepository.getLeads({ limit: 50 });
  const stats = await LeadsRepository.getLeadsStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Query Info</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage consultation requests and prospect tracking.</p>
        </div>
        <div className="flex gap-2">
          <ExportCsvButton leads={leads} />
          <AddManualLeadButton />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">New Leads (This Week)</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{stats.newLeadsThisWeek}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Consultations Scheduled</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{stats.consultationsScheduled}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Proposals Sent</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{stats.proposalsSent}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Conversion Rate</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{stats.conversionRate}%</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Name</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company Details</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Received</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{lead.fullName}</p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center"><Mail size={12} className="mr-1" /> {lead.email}</span>
                        <span className="flex items-center"><Phone size={12} className="mr-1" /> {lead.mobileNumber}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm font-medium text-slate-800 dark:text-slate-200">
                        <Building size={14} className="mr-2 text-slate-400 dark:text-slate-500" />
                        {lead.company || "Individual / Not specified"}
                      </div>
                      {lead.country && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Country: {lead.country}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        lead.status === 'New' ? 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' :
                        lead.status === 'Qualified' ? 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' :
                        'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-slate-400 dark:text-slate-500" />
                        {lead.createdAt ? (
                          <div className="flex flex-col">
                            <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                            <span className="text-xs">{formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}</span>
                          </div>
                        ) : 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <LeadActionsMenu lead={lead} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No leads found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
