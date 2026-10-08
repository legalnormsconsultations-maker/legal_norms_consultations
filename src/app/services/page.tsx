import { ServicesRepository } from "@/repositories/services-repository";
import Link from "next/link";
import { ArrowRight, ShieldCheck, FileText, CheckCircle } from "lucide-react";
import DynamicCards from "@/components/dynamic-cards";

export const metadata = {
  title: "Regulatory Services | Consultancy Platform",
  description: "Browse our comprehensive list of regulatory compliance and licensing services for CDSCO, FSSAI, EPR, and more.",
};

export default async function ServicesPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  const services = await ServicesRepository.getTopLevelServices({ limit: 50, search: query });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Regulatory & Compliance Services
          </h1>
          <p className="text-lg text-slate-600">
            End-to-end regulatory strategy, document preparation, and submission support for medical devices, cosmetics, pharmaceuticals, and food products in India.
          </p>
          <div className="flex justify-center max-w-lg mx-auto relative">
            <form action="/services" method="GET" className="w-full">
              <input 
                type="text" 
                name="q" 
                defaultValue={query}
                placeholder="Search services (e.g., MD-15, CDSCO, FSSAI...)" 
                className="w-full px-6 py-4 rounded-full border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
              <button type="submit" className="absolute right-2 top-2 bg-orange-600 text-black dark:text-white p-2 px-6 rounded-full font-semibold hover:bg-orange-700 transition">
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Services Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="group relative block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col h-full">
              <div className="p-8 flex-grow">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <ShieldCheck size={24} />
                  </span>
                  <span className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
                    {service.category || "General"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {service.shortDescription || service.description || "Comprehensive regulatory support and compliance management."}
                </p>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm text-slate-500 space-x-2">
                    <FileText size={16} />
                    <span>Documentation Support</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 space-x-2">
                    <CheckCircle size={16} />
                    <span>Application Filing</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-orange-600 font-semibold group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <span>View Full Details</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
          {services.length === 0 && (
            <div className="col-span-full text-center py-24 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-lg">No services found for "{query}". Try adjusting your search.</p>
            </div>
          )}
        </section>

        {/* Dynamic Content Cards */}
        <section>
          <DynamicCards pageName="services" />
        </section>
      </div>
    </main>
  );
}
