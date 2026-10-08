"use client";

import { useState } from "react";
import { editUserAction, deleteUserAction } from "@/actions/admin-actions";
import { MoreVertical, Loader2, X, Trash2, Edit } from "lucide-react";

type Props = {
  user: any;
  canEdit: boolean;
};

export function UserActionsMenu({ user, canEdit }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!canEdit) return null;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setIsOpen(false);
      setIsUpdating(true);
      const result = await deleteUserAction(user.id);
      setIsUpdating(false);
      
      if (result.success) {
        alert("User deleted successfully");
      } else {
        alert(result.error || "Failed to delete user");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    };

    const result = await editUserAction(user.id, data);
    setIsUpdating(false);

    if (result.success) {
      alert("User updated successfully");
      setShowEdit(false);
    } else {
      alert(result.error || "Failed to update user");
    }
  };

  return (
    <div className="relative inline-block ml-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <MoreVertical size={18} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowEdit(true);
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
            >
              <Edit size={14} className="mr-2" /> Edit Details
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
            >
              <Trash2 size={14} className="mr-2" /> Delete
            </button>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Edit User Details</h2>
              <button onClick={() => setShowEdit(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input required name="firstName" defaultValue={user.firstName} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input name="lastName" defaultValue={user.lastName || ""} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input required name="email" defaultValue={user.email} type="email" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-slate-900 dark:text-slate-100" />
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
