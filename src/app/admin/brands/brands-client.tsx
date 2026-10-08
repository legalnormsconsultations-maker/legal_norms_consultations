"use client";

import { useState, useEffect } from "react";
import { type TrustedBrand } from "@/repositories/trusted-brands-repository";
import { createTrustedBrand, updateTrustedBrand, deleteTrustedBrand } from "@/actions/trusted-brands";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

export function BrandsClient({ initialBrands }: { initialBrands: TrustedBrand[] }) {
  const router = useRouter();
  const [brands, setBrands] = useState<TrustedBrand[]>(initialBrands);
  
  useEffect(() => {
    setBrands(initialBrands);
  }, [initialBrands]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [iconName, setIconName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setLogoUrl("");
    setIconName("");
    setSortOrder("0");
    setIsActive(true);
    setIsAdding(false);
    setEditingId(null);
  };

  const startEditing = (brand: TrustedBrand) => {
    setName(brand.name);
    setLogoUrl(brand.logoUrl || "");
    setIconName(brand.iconName || "");
    setSortOrder(brand.sortOrder.toString());
    setIsActive(brand.isActive);
    setEditingId(brand.id);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name,
      logoUrl: logoUrl || null,
      iconName: iconName || null,
      sortOrder: parseInt(sortOrder, 10) || 0,
      isActive
    };

    try {
      if (editingId) {
        const updated = await updateTrustedBrand(editingId, data);
        setBrands(brands.map(b => b.id === editingId ? updated : b));
      } else {
        const created = await createTrustedBrand(data);
        setBrands([...brands, created]);
      }
      resetForm();
      router.refresh();
    } catch (error) {
      console.error("Failed to save brand:", error);
      alert("Failed to save brand. Please check the console.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await deleteTrustedBrand(id);
      setBrands(brands.filter(b => b.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete brand:", error);
      alert("Failed to delete brand.");
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
            <Plus size={16} /> Add Brand
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-secondary/30 p-6 rounded-xl border border-border mb-8 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{editingId ? "Edit Brand" : "Add New Brand"}</h3>
            <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company / Organization Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="e.g. MedCorp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon Name (Lucide)</label>
              <input
                type="text"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="e.g. Globe, Shield (Capitalized)"
              />
              <p className="text-xs text-muted-foreground mt-1">Fallback if logo URL is empty.</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="https://example.com/logo.png"
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
            <div className="flex items-center pt-6">
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
              Save Brand
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary text-secondary-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Brand / Company Name</th>
              <th className="px-6 py-4">Logo / Icon</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {brands.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No brands found. Click "Add Brand" to create one.
                </td>
              </tr>
            ) : (
              brands.map((brand) => {
                // Determine icon
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const IconComponent = brand.iconName && (LucideIcons as any)[brand.iconName] 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ? (LucideIcons as any)[brand.iconName] 
                  : LucideIcons.Building2;

                return (
                  <tr key={brand.id} className="hover:bg-secondary/20 bg-card">
                    <td className="px-6 py-4 font-medium">{brand.name}</td>
                    <td className="px-6 py-4">
                      {brand.logoUrl ? (
                        <img src={brand.logoUrl} alt={brand.name} className="h-8 object-contain max-w-[100px]" />
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <IconComponent size={20} />
                          <span className="text-xs">{brand.iconName || "Default (Building2)"}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        brand.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{brand.sortOrder}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => startEditing(brand)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded hover:bg-secondary"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
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
