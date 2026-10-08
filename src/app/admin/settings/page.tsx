"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateSiteSettings } from "@/app/actions/settings";

export default function SiteSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contactNumber: "",
    email: "",
    whatsappNumber: "",
    instagramUrl: "",
    facebookUrl: "",
    xUrl: "",
    linkedinUrl: "",
    discordUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    import("@/app/actions/settings").then(({ getSiteSettings }) => {
      getSiteSettings()
        .then(data => {
          if (data) {
            setFormData({
              contactNumber: data.contactNumber || "",
              email: data.email || "",
              whatsappNumber: data.whatsappNumber || "",
              instagramUrl: data.instagramUrl || "",
              facebookUrl: data.facebookUrl || "",
              xUrl: data.xUrl || "",
              linkedinUrl: data.linkedinUrl || "",
              discordUrl: data.discordUrl || "",
            });
          }
        })
        .catch(console.error);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    try {
      await updateSiteSettings(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Site Settings</h1>
        <p className="text-slate-500 mt-2">Manage contact details and social media links.</p>
      </div>

      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Number</label>
            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="+1234567890" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp Number</label>
            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="+1234567890" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="contact@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Instagram URL</label>
            <input type="text" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Facebook URL</label>
            <input type="text" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">X (Twitter) URL</label>
            <input type="text" name="xUrl" value={formData.xUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn URL</label>
            <input type="text" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Discord URL</label>
            <input type="text" name="discordUrl" value={formData.discordUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="px-6 py-2 bg-orange-600 text-black dark:text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50">
            {isLoading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
