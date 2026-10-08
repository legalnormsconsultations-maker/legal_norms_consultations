import { ServicesRepository } from "@/repositories/services-repository";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle, Clock, FileText, IndianRupee, Landmark } from "lucide-react";
import Link from "next/link";

import { ConsultationForm } from "@/components/ConsultationForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await ServicesRepository.getServiceBySlug(resolvedParams.slug);
  if (!data?.service) return { title: "Service Not Found" };
  
  return {
    title: data.service.seoTitle || `${data.service.name} | Consultancy Platform`,
    description: data.service.seoDescription || data.service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  console.log("DEBUG params:", params, "resolved:", resolvedParams);
  const data = await ServicesRepository.getServiceBySlug(resolvedParams?.slug);
  
  if (!data?.service) {
    notFound();
  }

  const { service, authority } = data;
  const workflowSteps = (service.workflowSteps as string[]) || [];
  const requiredDocuments = (service.requiredDocuments as string[]) || [];

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-orange-900 text-white pt-24 pb-32 px-6 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-400 via-orange-900 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-800/50 rounded-full border border-orange-700 text-sm font-medium">
              <Landmark size={16} />
              <span>{authority?.name || "Regulatory Authority"}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              {service.name}
            </h1>
            <p className="text-lg lg:text-xl text-orange-100 max-w-2xl leading-relaxed">
              {service.shortDescription || "Expert regulatory consulting to secure your approvals quickly and accurately."}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="#consultation" className="bg-white text-orange-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition shadow-lg">
                Get a Free Consultation
              </Link>
              <Link href="#process" className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition">
                View the Process
              </Link>
            </div>
          </div>
          {/* Info Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-slate-900 space-y-6">
            <h3 className="text-xl font-bold border-b pb-4">Key Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Clock className="text-orange-600 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-slate-900">Estimated Timeline</p>
                  <p className="text-slate-600">{service.estimatedTimeline || "Varies by application type"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <IndianRupee className="text-orange-600 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-slate-900">Government Fees</p>
                  <p className="text-slate-600">Refer to latest {authority?.name || "authority"} fee schedule</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FileText className="text-orange-600 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-slate-900">Document Complexity</p>
                  <p className="text-slate-600">{requiredDocuments.length > 5 ? "High" : "Moderate"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          
          {/* Description Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">What is this approval?</h2>
            <div className="prose prose-lg text-slate-600 max-w-none">
              <p>{service.description || "Detailed description not provided yet."}</p>
            </div>
          </section>

          {/* Eligibility & Applicability */}
          {service.eligibility && (
            <section className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Who needs it? (Eligibility)</h2>
              <div className="prose prose-lg text-slate-600">
                <p>{service.eligibility}</p>
              </div>
            </section>
          )}

          {/* Workflow/Process Engine UI */}
          <section id="process" className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Step-by-Step Process</h2>
            {workflowSteps.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-orange-600 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      {index + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{step}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
                <p className="text-slate-600">The specific workflow stages are currently being documented by our regulatory experts.</p>
              </div>
            )}
          </section>

          {/* Document Checklist */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Required Documents Checklist</h2>
            {requiredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">{doc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">Please schedule a consultation for a customized document checklist tailored to your product portfolio.</p>
            )}
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Quick Consultation Form */}
          <div id="consultation" className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sticky top-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Consultation</h3>
            <p className="text-slate-500 text-sm mb-6">Our experts will review your requirement and reach out within 24 hours.</p>
            
              <ConsultationForm serviceId={service.id} />
            </div>
          </aside>
        </div>
      </main>
    );
  }
