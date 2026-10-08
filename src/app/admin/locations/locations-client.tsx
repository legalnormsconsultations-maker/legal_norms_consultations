"use client";

import { useState, useEffect } from "react";
import { type CompanyLocation } from "@/repositories/company-locations-repository";
import { createCompanyLocation, updateCompanyLocation, deleteCompanyLocation } from "@/actions/company-locations";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X, MapPin } from "lucide-react";

export function LocationsClient({ initialLocations }: { initialLocations: CompanyLocation[] }) {
  const router = useRouter();
  const [locations, setLocations] = useState<CompanyLocation[]>(initialLocations);
  
  useEffect(() => {
    setLocations(initialLocations);
  }, [initialLocations]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [officeName, setOfficeName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const resetForm = () => {
    setOfficeName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setGoogleMapsUrl("");
    setIsPrimary(false);
    setIsActive(true);
    setSortOrder("0");
    setIsAdding(false);
    setEditingId(null);
  };

  const startEditing = (location: CompanyLocation) => {
    setOfficeName(location.officeName);
    setAddress(location.address);
    setPhone(location.phone || "");
    setEmail(location.email || "");
    setGoogleMapsUrl(location.googleMapsUrl || "");
    setIsPrimary(location.isPrimary);
    setIsActive(location.isActive);
    setSortOrder(location.sortOrder.toString());
    setEditingId(location.id);
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      officeName,
      address,
      phone: phone || null,
      email: email || null,
      googleMapsUrl: googleMapsUrl || null,
      isPrimary,
      isActive,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };

    try {
      if (editingId) {
        const updated = await updateCompanyLocation(editingId, data);
        setLocations(locations.map(l => {
            if (l.id === editingId) return updated;
            if (data.isPrimary) return { ...l, isPrimary: false };
            return l;
        }));
      } else {
        const created = await createCompanyLocation(data);
        setLocations((prev) => [
            ...prev.map(l => data.isPrimary ? { ...l, isPrimary: false } : l),
            created
        ]);
      }
      resetForm();
      router.refresh();
    } catch (error) {
      console.error("Failed to save location:", error);
      alert("Failed to save location.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await deleteCompanyLocation(id);
      setLocations(locations.filter(l => l.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete location:", error);
      alert("Failed to delete location.");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90"
          >
            <Plus size={16} /> Add Location
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-secondary/30 p-6 rounded-xl border border-border mb-8 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{editingId ? "Edit Location" : "Add New Location"}</h3>
            <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Office Name *</label>
              <input
                type="text"
                required
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="e.g. New York Headquarters"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address *</label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background resize-y"
                placeholder="123 Corporate Blvd, Suite 400..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="contact@company.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Google Maps URL</label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
              />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Primary Location
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Is Active
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90"
            >
              Save Location
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary text-secondary-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Office Name</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {locations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No locations found. Click "Add Location" to create one.
                </td>
              </tr>
            ) : (
              locations.map((location) => {
                return (
                  <tr key={location.id} className="hover:bg-secondary/20 bg-card">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-muted-foreground" />
                        {location.officeName}
                        {location.isPrimary && (
                          <span className="ml-2 bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Primary
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-2 max-w-xs whitespace-pre-line text-muted-foreground">{location.address}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {location.phone && <div className="text-xs mb-1">📞 {location.phone}</div>}
                      {location.email && <div className="text-xs">✉️ {location.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        location.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {location.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => startEditing(location)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded hover:bg-secondary"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-secondary/50 rounded hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
