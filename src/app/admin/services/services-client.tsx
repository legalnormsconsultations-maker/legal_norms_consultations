"use client";

import { useState, useActionState } from "react";
import { Plus, Edit3, Trash2, ShieldCheck, Search, X, Loader2 } from "lucide-react";
import { createServiceAction, updateServiceAction, deleteServiceAction } from "@/app/actions/services";

type Service = {
  id: string;
  name: string;
  slug: string;
  authorityId?: string | null;
  parentId?: string | null;
  category?: string | null;
  subcategory?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  status?: string | null;
};

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const [state, formAction, pending] = useActionState(
    editingService ? updateServiceAction : createServiceAction,
    null
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const res = await deleteServiceAction(id);
      if (res.success) {
        setServices(services.filter((s) => s.id !== id));
      } else {
        alert("Failed to delete service.");
      }
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  // Close modal on success
  if (state?.success && isModalOpen) {
    setIsModalOpen(false);
    // Reload page to get fresh data is handled by Next.js server actions revalidatePath, 
    // but to reflect instantly without full refresh in a simple setup, we might need a router.refresh() 
    // or just let the user see it on page reload. For now, window.location.reload() is robust.
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Service Catalogue</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage regulatory services, authorities, and hierarchy.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-orange-600 text-black dark:text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 shadow-sm flex items-center justify-center"
        >
          <Plus size={18} className="mr-2" /> Add New Service
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search services..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service Details</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type / Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{service.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md truncate">{service.description || service.shortDescription}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-800 uppercase tracking-wider">
                      {service.category || 'Service'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => openEditModal(service)}
                        className="text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 p-2 rounded-lg transition" title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition" title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No services found. Start adding services to build your catalogue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
                <X size={20} />
              </button>
            </div>
            
            <form action={formAction} className="p-6 overflow-y-auto flex-1">
              {state?.success === false && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200">
                  {state.message}
                </div>
              )}
              
              {editingService && <input type="hidden" name="id" value={editingService.id} />}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Name *</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    defaultValue={editingService?.name || ""}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug *</label>
                  <input 
                    name="slug" 
                    type="text" 
                    required 
                    defaultValue={editingService?.slug || ""}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input 
                    name="category" 
                    type="text" 
                    defaultValue={editingService?.category || ""}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select 
                    name="status" 
                    defaultValue={editingService?.status || "Published"}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    rows={4}
                    defaultValue={editingService?.description || editingService?.shortDescription || ""}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={pending}
                  className="px-6 py-2 bg-orange-600 text-black dark:text-white font-bold rounded-lg hover:bg-orange-700 transition flex items-center disabled:opacity-50"
                >
                  {pending ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                  {editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
