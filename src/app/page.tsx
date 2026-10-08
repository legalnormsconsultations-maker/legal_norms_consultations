import { ServicesRepository } from "@/repositories/services-repository";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Users, FileCheck, Landmark, Globe, Building2 } from "lucide-react";
import { ConsultationForm } from "@/components/ConsultationForm";
import { getCurrentUser } from "@/lib/auth";
import { MobileNav } from "@/components/home/mobile-nav";
import { UserProfileMenu } from "@/components/home/user-profile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrustedBrandsRepository } from "@/repositories/trusted-brands-repository";
import { ClientTestimonialsRepository } from "@/repositories/client-testimonials-repository";
import { CompanyLocationsRepository } from "@/repositories/company-locations-repository";
import { Star, MapPin, MessageCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ContactModal } from "@/components/ContactModal";

export const metadata = {
  title: "Modern Regulatory Consulting Platform",
  description: "End-to-end regulatory strategy, document preparation, and submission support for medical devices, cosmetics, pharmaceuticals, and food products.",
};

export default async function HomePage() {
  const topServices = await ServicesRepository.getTopLevelServices({ limit: 6 });
  const user = await getCurrentUser();
  const trustedBrands = await TrustedBrandsRepository.getActiveBrands();
  const testimonials = await ClientTestimonialsRepository.getActiveTestimonials();
  const locations = await CompanyLocationsRepository.getActiveLocations();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      
      {/* Navigation (Simplified for Demo) */}
      <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <Shield size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              <span className="hidden lg:inline">LegalNorms</span><span className="lg:hidden">LN</span> <span className="text-primary">Consultations</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 font-medium text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition">About</Link>
            <Link href="/services" className="hover:text-primary transition">Services</Link>
            <Link href="/portfolio" className="hover:text-primary transition">Portfolio</Link>
            <Link href="/blog" className="hover:text-primary transition">Blog</Link>
            <Link href="/contact" className="hover:text-primary transition">Contact Us</Link>
            <div className="flex items-center gap-6 border-l border-border pl-6">
              <ThemeToggle />
              {user ? (
                <UserProfileMenu user={user} />
              ) : (
                <Link href="/login" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition shadow-sm font-semibold">
                  Sign In
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            {user ? (
              <UserProfileMenu user={user} />
            ) : (
              <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition shadow-sm font-semibold text-sm">
                Sign In
              </Link>
            )}
            <MobileNav isLoggedIn={!!user} />
          </div>
        </div>
      </nav>

      <main>
        {/* A. Primary Value Proposition (Hero) */}
        <section className="bg-background border-b border-border py-20 lg:py-32 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wide uppercase border border-primary/20">
                <span>India's Leading Regulatory Consultants</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Secure your regulatory approvals, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-300">faster.</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Comprehensive compliance, licensing, and documentation support for CDSCO, FSSAI, EPR, and Legal Metrology. Navigate complex regulations with confidence.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="#consultation" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-primary/30 flex items-center gap-2">
                  <span>Start Your Journey</span>
                  <ArrowRight size={20} />
                </Link>
                <Link href="/services" className="bg-card border-2 border-border text-foreground px-8 py-4 rounded-xl font-bold hover:bg-accent hover:text-accent-foreground transition flex items-center gap-2">
                  Explore Services
                </Link>
              </div>
            </div>
            
            {/* C. Lead Form (Hero variant) */}
            <div className="bg-card rounded-3xl p-8 shadow-2xl shadow-black/5 dark:shadow-black/40 border border-border relative">
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-4 rounded-full shadow-lg">
                <FileCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">Request Expert Review</h3>
              <p className="text-muted-foreground mb-8">Get clarity on your product's regulatory pathway.</p>
              <ConsultationForm serviceId="" />
            </div>
          </div>
        </section>

        {/* F. Clientele / Social Proof */}
        {trustedBrands.length > 0 && (
          <section className="py-12 bg-zinc-950 border-b border-zinc-900 px-6">
            <div className="max-w-7xl mx-auto">
              <p className="text-center text-zinc-400 font-medium mb-8 text-sm uppercase tracking-widest">
                Trusted by {trustedBrands.length}+ Healthcare & FMCG Brands Worldwide
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale">
                {trustedBrands.map((brand) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const IconComponent = brand.iconName && (LucideIcons as any)[brand.iconName] 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ? (LucideIcons as any)[brand.iconName] 
                    : LucideIcons.Building2;
                  return (
                    <div key={brand.id} className="text-2xl font-black text-white flex items-center gap-2">
                      {brand.logoUrl ? (
                        <img src={brand.logoUrl} alt={brand.name} className="h-8 object-contain max-w-[150px]" />
                      ) : (
                        <>
                          <IconComponent /> {brand.name}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* B. Regulatory Service Discovery */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Explore Our Expertise</h2>
              <p className="text-lg text-muted-foreground">
                From pre-market approval to post-market compliance, we provide end-to-end solutions across major regulatory authorities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topServices.length > 0 ? topServices.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`} className="group bg-card rounded-2xl shadow-sm border border-border p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {service.shortDescription || "Comprehensive licensing and registration support."}
                  </p>
                  <div className="flex items-center text-primary font-bold space-x-2">
                    <span>Learn More</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )) : (
                <div className="col-span-full text-center p-12 bg-card rounded-2xl border border-border">
                  <p className="text-muted-foreground">No services found. Run migrations and seed the database.</p>
                </div>
              )}
            </div>

            <div className="text-center">
              <Link href="/services" className="inline-flex bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition shadow-lg">
                View All Services
              </Link>
            </div>
          </div>
        </section>

        {/* E. Why Choose Us */}
        <section className="py-24 px-6 bg-background border-y border-border">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Why Partner With Us?</h2>
              <p className="text-lg text-muted-foreground">
                We remove the guesswork from regulatory compliance, minimizing delays and maximizing your product's market access.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 text-green-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Former Authority Experts</h4>
                    <p className="text-muted-foreground mt-1">Our team includes former regulators who understand the intricate internal processes.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 text-green-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Flawless Documentation</h4>
                    <p className="text-muted-foreground mt-1">We prepare, review, and structure your technical dossiers to ensure zero-deficiency filings.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 text-green-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">End-to-End Tracking</h4>
                    <p className="text-muted-foreground mt-1">From initial application to final certificate issuance, we manage the entire lifecycle.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-3xl p-12 relative overflow-hidden border border-border/50">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
              <div className="relative z-10 space-y-8">
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
                  <h4 className="text-3xl font-black text-primary mb-2">99.8%</h4>
                  <p className="text-card-foreground font-medium">First-time Approval Rate</p>
                </div>
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
                  <h4 className="text-3xl font-black text-primary mb-2">2,500+</h4>
                  <p className="text-card-foreground font-medium">Licenses Secured</p>
                </div>
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
                  <h4 className="text-3xl font-black text-primary mb-2">40+</h4>
                  <p className="text-card-foreground font-medium">Countries Supported</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-24 px-6 bg-secondary/30 border-y border-border">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                  What Our Clients Say
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Hear from the organizations and professionals who trust us with their regulatory compliance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                    <div className="flex gap-1 text-amber-500 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={18} className={i < t.rating ? "fill-current" : "text-muted-foreground opacity-30"} />
                      ))}
                    </div>
                    
                    <p className="text-card-foreground flex-grow mb-8 italic">
                      "{t.review}"
                    </p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      {t.profilePicUrl ? (
                        <img src={t.profilePicUrl} alt={t.clientName} className="w-12 h-12 rounded-full object-cover border border-border" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-border">
                          {t.clientName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{t.clientName}</h4>
                        <p className="text-muted-foreground text-xs font-medium">
                          {t.occupation} {t.occupation && t.organization && <span className="mx-1">•</span>} {t.organization}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* I. Final Consultation CTA */}
        <section id="consultation" className="py-24 px-6 bg-primary dark:bg-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white dark:text-foreground tracking-tight">
              Ready to launch your product?
            </h2>
            <p className="text-xl text-orange-100 dark:text-muted-foreground">
              Speak with our regulatory specialists today. We provide actionable roadmaps tailored to your unique compliance needs.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <ContactModal mode="call">
                <button className="bg-white dark:bg-primary text-orange-900 dark:text-primary-foreground px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 dark:hover:opacity-90 transition shadow-2xl hover:scale-105 inline-flex items-center justify-center w-full sm:w-auto">
                  Schedule a Strategy Call
                </button>
              </ContactModal>
              
              <ContactModal mode="chat">
                <button className="bg-orange-600 text-black dark:text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-orange-700 dark:hover:bg-slate-700 transition shadow-2xl hover:scale-105 flex items-center justify-center gap-3 w-full sm:w-auto">
                  <MessageCircle size={24} />
                  <span>Chat with Us</span>
                </button>
              </ContactModal>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand & Socials */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
            <div className="flex items-center gap-2 text-white font-bold text-2xl">
              <Shield size={24} className="text-primary" />
              LegalNorms
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
              End-to-end regulatory strategy, document preparation, and submission support for medical devices, cosmetics, and pharmaceuticals.
            </p>
            <div className="flex items-center gap-4 text-zinc-400 mt-2">
              <Link href="#" className="hover:text-primary transition" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Link>
              <Link href="#" className="hover:text-primary transition" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Link>
              <Link href="#" className="hover:text-primary transition" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm mb-2">Company</h4>
            <Link href="/about" className="text-sm hover:text-white transition">About Us</Link>
            <Link href="/services" className="text-sm hover:text-white transition">Services</Link>
            <Link href="/portfolio" className="text-sm hover:text-white transition">Portfolio</Link>
            <Link href="/blog" className="text-sm hover:text-white transition">Blog</Link>
            <Link href="/contact" className="text-sm hover:text-white transition">Contact</Link>
          </div>

          {/* Global Locations */}
          {locations.length > 0 && (
            <div className="lg:col-span-6">
              <h4 className="text-white font-bold tracking-wide uppercase text-sm mb-6 text-center md:text-left">Our Offices</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center md:text-left">
                {locations.map((loc) => (
                  <div key={loc.id} className="flex flex-col gap-3">
                    <h5 className="text-zinc-200 font-semibold flex items-center justify-center md:justify-start gap-2">
                      <MapPin size={16} className="text-primary" />
                      {loc.officeName}
                      {loc.isPrimary && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">HQ</span>}
                    </h5>
                    <p className="text-sm text-zinc-500 whitespace-pre-line leading-relaxed">
                      {loc.address}
                    </p>
                    <div className="flex flex-col gap-1 mt-1 text-sm text-zinc-400">
                      {loc.phone && <p>📞 {loc.phone}</p>}
                      {loc.email && <p>✉️ {loc.email}</p>}
                    </div>
                    {loc.googleMapsUrl && (
                      <a href={loc.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition text-sm font-medium mt-1 inline-flex items-center justify-center md:justify-start gap-1">
                        Get Directions <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-zinc-600">&copy; {new Date().getFullYear()} LegalNorms Consultations. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
