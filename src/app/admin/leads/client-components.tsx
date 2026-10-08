"use client";

import { useState } from "react";
import { updateLeadStatusAction, createManualLeadAction, updateLeadAction, deleteLeadAction } from "./actions";
import { MoreVertical, Loader2, X } from "lucide-react";

export function LeadActionsMenu({ lead }: { lead: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const statuses = ["New", "Contacted", "Qualified", "Consultation Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"];

  const handleStatusChange = async (newStatus: string) => {
    setIsOpen(false);
    setIsUpdating(true);
    const result = await updateLeadStatusAction(lead.id, newStatus);
    setIsUpdating(false);
    
    if (result.success) {
      alert(`Status updated to ${newStatus}`);
    } else {
      alert(result.error || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      setIsOpen(false);
      setIsUpdating(true);
      const result = await deleteLeadAction(lead.id);
      setIsUpdating(false);
      
      if (result.success) {
        alert("Lead deleted successfully");
      } else {
        alert(result.error || "Failed to delete lead");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      mobileNumber: formData.get("mobileNumber") as string,
      company: formData.get("company") as string,
      country: formData.get("country") as string,
      message: formData.get("message") as string,
    };

    const result = await updateLeadAction(lead.id, data);
    setIsUpdating(false);

    if (result.success) {
      alert("Lead updated successfully");
      setShowEdit(false);
    } else {
      alert(result.error || "Failed to update lead");
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <MoreVertical size={18} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowDetails(true);
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
            >
              View Details
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowEdit(true);
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
            >
              Edit Lead
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
            >
              Delete Lead
            </button>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 mb-1 px-2 border-t border-slate-100 dark:border-slate-800 pt-2">Update Status</div>
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                  status === lead.status 
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-medium' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Lead Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Full Name</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{lead.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{lead.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Mobile Number</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{lead.mobileNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Company</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{lead.company || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Country</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{lead.country || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{lead.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Message / Query</p>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {lead.message || "No message provided."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Source URL</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100 break-all">{lead.sourceUrl || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Created At</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Edit Lead</h2>
              <button onClick={() => setShowEdit(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input required name="fullName" defaultValue={lead.fullName} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input required name="email" defaultValue={lead.email} type="email" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                  <input required name="mobileNumber" defaultValue={lead.mobileNumber || ""} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                  <input name="company" defaultValue={lead.company || ""} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                  <input name="country" defaultValue={lead.country || ""} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message / Query</label>
                  <textarea name="message" defaultValue={lead.message || ""} rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100"></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowEdit(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="px-4 py-2 bg-orange-600 text-black dark:text-white rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center"
                  >
                    {isUpdating ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExportCsvButton({ leads }: { leads: any[] }) {
  const handleExport = () => {
    // Generate CSV
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Status", "Created At"];
    const csvContent = [
      headers.join(","),
      ...leads.map(l => [
        l.id,
        `"${l.fullName}"`,
        `"${l.email}"`,
        `"${l.mobileNumber || ''}"`,
        `"${l.company || ''}"`,
        `"${l.status}"`,
        `"${l.createdAt}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Exported leads to CSV");
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
    >
      Export CSV
    </button>
  );
}

export function AddManualLeadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      mobileNumber: formData.get("mobileNumber") as string,
      company: formData.get("company") as string,
      country: formData.get("country") as string,
    };

    const result = await createManualLeadAction(data);
    setIsSubmitting(false);

    if (result.success) {
      alert("Lead created successfully");
      setIsOpen(false);
    } else {
      alert(result.error || "Failed to create lead");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-orange-600 text-black dark:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 shadow-sm"
      >
        Add Manual Lead
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Manual Lead</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input required name="fullName" type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent" placeholder="Jane Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                <input required name="email" type="email" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent" placeholder="jane@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                <input required name="mobileNumber" type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent" placeholder="+1 234 567 890" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                <input name="company" type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent" placeholder="Acme Corp" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                <input name="country" type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent" placeholder="United States" />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-orange-600 text-black dark:text-white rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
