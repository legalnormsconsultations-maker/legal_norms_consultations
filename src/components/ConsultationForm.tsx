"use client";

import { useActionState } from "react";
import { submitLeadAction } from "@/app/actions/leads";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";

import { COUNTRIES } from "@/lib/countries";

export function ConsultationForm({ serviceId }: { serviceId: string }) {
  const [state, formAction, pending] = useActionState(submitLeadAction, null);

  if (state?.success) {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center space-y-3">
        <CheckCircle className="mx-auto text-green-600" size={32} />
        <p className="font-medium">{state.message}</p>
        <p className="text-sm opacity-80">We will reach out to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-left">
      {state?.success === false && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {state.message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
        <input name="fullName" type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
        <input name="company" type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Work Email *</label>
        <input name="email" type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
        <div className="flex gap-2">
          <select 
            name="countryCode" 
            className="w-1/3 px-2 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm"
            required
            defaultValue="+91"
          >
            {COUNTRIES.map(c => (
              <option key={c.name} value={c.code}>
                {c.code} {c.name}
              </option>
            ))}
          </select>
          <input name="mobileNumber" type="tel" className="w-2/3 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none" required placeholder="Phone number" />
        </div>
      </div>
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="sourceUrl" value={typeof window !== "undefined" ? window.location.href : ""} />
      
      <button 
        type="submit" 
        disabled={pending}
        className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition shadow-md flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>Submit Request</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
