"use client";

import { useState } from "react";
import { portfolioProjects } from "@/db/schema";
import { saveProjectAction, deleteProjectAction } from "./actions";
import { Plus, Edit2, Trash2, ShieldCheck, X, Calendar } from "lucide-react";
import { toast } from "sonner";

type Project = typeof portfolioProjects.$inferSelect;

export function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    startDate: "",
    endDate: ""
  });

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const openNew = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      startDate: "",
      endDate: ""
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setFormData({
      title: p.title,
      description: p.description || "",
      url: p.url || "",
      startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : "",
      endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : ""
    });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        url: formData.url,
      };

      if (formData.startDate) payload.startDate = new Date(formData.startDate);
      if (formData.endDate) payload.endDate = new Date(formData.endDate);
      
      if (editingId) {
        payload.id = editingId;
      }

      const res = await saveProjectAction(payload);
      if (res.success) {
        toast.success(editingId ? "Project updated" : "Project created");
        
        // Optimistic update for UI without full page reload
        if (editingId) {
          setProjects(projects.map(p => p.id === editingId ? { ...p, ...payload, updatedAt: new Date() } : p));
        } else {
          // just reload page data to get the new ID from server
          window.location.reload();
        }
        
        setIsModalOpen(false);
      } else {
        toast.error(res.error || "Failed to save project");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setIsLoading(true);
    try {
      const res = await deleteProjectAction(id);
      if (res.success) {
        toast.success("Project deleted");
        setProjects(projects.filter(p => p.id !== id));
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search projects..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        <button 
          onClick={openNew}
          className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-black dark:text-white font-medium rounded-lg transition-colors w-full sm:w-auto justify-center text-sm"
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4 rounded-tl-lg">Project Info</th>
              <th className="px-6 py-4">Timeline</th>
              <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No projects found. Add one to get started.
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg shrink-0 mt-1">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{p.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 max-w-md">{p.description || "No description provided."}</p>
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline mt-2 inline-block">
                            View External Link
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {p.startDate || p.endDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span>
                          {p.startDate ? new Date(p.startDate).toLocaleDateString() : 'TBD'} 
                          {' - '} 
                          {p.endDate ? new Date(p.endDate).toLocaleDateString() : 'Present'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No timeline set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEdit(p)}
                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        disabled={isLoading}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Project" : "Add New Project"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent"
                    placeholder="e.g. Acme Corp FDA Submission"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent resize-none"
                    placeholder="Brief details about the project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reference URL</label>
                  <input 
                    type="url" 
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent"
                    placeholder="https://example.com/project-case-study"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-black dark:text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center"
                >
                  {isLoading ? (
                    <>Saving...</>
                  ) : (
                    <>Save Project</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
