import { ClientTestimonialsRepository } from "@/repositories/client-testimonials-repository";
import { TestimonialsClient } from "./testimonials-client";

export default async function AdminTestimonialsPage() {
  const testimonials = await ClientTestimonialsRepository.getAllTestimonials();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Client Testimonials</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage the client reviews and opinions shown on the homepage.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl p-6">
        <TestimonialsClient initialTestimonials={testimonials} />
      </div>
    </div>
  );
}
