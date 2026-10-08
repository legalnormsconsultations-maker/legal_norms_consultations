"use client";

import { useState, useEffect } from "react";
import { type ClientTestimonial } from "@/repositories/client-testimonials-repository";
import { createClientTestimonial, updateClientTestimonial, deleteClientTestimonial } from "@/actions/client-testimonials";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X, Star } from "lucide-react";

export function TestimonialsClient({ initialTestimonials }: { initialTestimonials: ClientTestimonial[] }) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<ClientTestimonial[]>(initialTestimonials);
  
  useEffect(() => {
    setTestimonials(initialTestimonials);
  }, [initialTestimonials]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [clientName, setClientName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [organization, setOrganization] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [rating, setRating] = useState("5");
  const [review, setReview] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setClientName("");
    setOccupation("");
    setOrganization("");
    setProfilePicUrl("");
    setRating("5");
    setReview("");
    setSortOrder("0");
    setIsActive(true);
    setIsAdding(false);
    setEditingId(null);
  };

  const startEditing = (testimonial: ClientTestimonial) => {
    setClientName(testimonial.clientName);
    setOccupation(testimonial.occupation || "");
    setOrganization(testimonial.organization || "");
    setProfilePicUrl(testimonial.profilePicUrl || "");
    setRating(testimonial.rating.toString());
    setReview(testimonial.review);
    setSortOrder(testimonial.sortOrder.toString());
    setIsActive(testimonial.isActive);
    setEditingId(testimonial.id);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      clientName,
      occupation: occupation || null,
      organization: organization || null,
      profilePicUrl: profilePicUrl || null,
      rating: parseInt(rating, 10) || 5,
      review,
      sortOrder: parseInt(sortOrder, 10) || 0,
      isActive
    };

    try {
      if (editingId) {
        const updated = await updateClientTestimonial(editingId, data);
        setTestimonials(testimonials.map(t => t.id === editingId ? updated : t));
      } else {
        const created = await createClientTestimonial(data);
        setTestimonials([...testimonials, created]);
      }
      resetForm();
      router.refresh();
    } catch (error) {
      console.error("Failed to save testimonial:", error);
      alert("Failed to save testimonial. Please check the console.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteClientTestimonial(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
      alert("Failed to delete testimonial.");
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
            <Plus size={16} /> Add Testimonial
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-secondary/30 p-6 rounded-xl border border-border mb-8 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h3>
            <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Occupation / Job Title</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="e.g. CEO, Regulatory Affairs Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="e.g. MedCorp Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Profile Picture URL</label>
              <input
                type="text"
                value={profilePicUrl}
                onChange={(e) => setProfilePicUrl(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="https://example.com/profile.jpg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Review / Comment *</label>
              <textarea
                required
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background resize-y"
                placeholder="The team was exceptional in handling our regulatory needs..."
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
              Save Testimonial
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary text-secondary-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Review</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No testimonials found. Click "Add Testimonial" to create one.
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => {
                return (
                  <tr key={testimonial.id} className="hover:bg-secondary/20 bg-card">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        {testimonial.profilePicUrl ? (
                          <img src={testimonial.profilePicUrl} alt={testimonial.clientName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {testimonial.clientName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div>{testimonial.clientName}</div>
                          <div className="text-xs text-muted-foreground">
                            {testimonial.occupation} {testimonial.occupation && testimonial.organization && "-"} {testimonial.organization}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-2 max-w-xs">{testimonial.review}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < testimonial.rating ? "fill-current" : "text-muted-foreground"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        testimonial.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {testimonial.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => startEditing(testimonial)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded hover:bg-secondary"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
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
