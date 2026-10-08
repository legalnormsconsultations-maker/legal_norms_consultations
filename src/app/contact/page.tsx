import { H1, Paragraph } from "@/components/ui/typography";
import { ContactForm } from "./contact-form";
import { CompanyLocationsRepository } from "@/repositories/company-locations-repository";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Contact Us | LegalNorms",
  description: "Get in touch with our regulatory experts for enterprise plans, API access, and consultation.",
};

export default async function ContactPage() {
  const locations = await CompanyLocationsRepository.getActiveLocations();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
      <div className="space-y-4 mb-12 text-center md:text-left">
        <H1>Contact Us</H1>
        <Paragraph className="text-lg text-muted-foreground max-w-2xl">
          Have questions about our enterprise plans, API access, or need a regulatory consultation? Reach out to our team.
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="order-2 lg:order-1 space-y-12">
          {locations.length > 0 ? (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold tracking-tight">Our Locations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {locations.map((location) => (
                  <div key={location.id} className="bg-secondary/30 p-6 rounded-2xl border border-border flex flex-col h-full relative">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <MapPin className="text-primary flex-shrink-0" size={20} />
                        <span className="break-words">{location.officeName}</span>
                      </h4>
                      {location.isPrimary && (
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded flex-shrink-0 mt-1">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3 flex-grow text-muted-foreground">
                      <p className="whitespace-pre-line">{location.address}</p>
                      
                      {location.phone && (
                        <div className="flex items-center gap-2 pt-2">
                          <Phone size={16} className="text-foreground" />
                          <a href={`tel:${location.phone}`} className="hover:text-primary transition-colors">
                            {location.phone}
                          </a>
                        </div>
                      )}
                      
                      {location.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-foreground" />
                          <a href={`mailto:${location.email}`} className="hover:text-primary transition-colors">
                            {location.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {location.googleMapsUrl && (
                      <div className="mt-6 pt-4 border-t border-border">
                        <a 
                          href={location.googleMapsUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                          View on Google Maps <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-secondary/20 p-8 rounded-2xl border border-border text-center">
              <h3 className="text-xl font-bold mb-2">Get In Touch</h3>
              <p className="text-muted-foreground">
                Fill out the form and our team will get back to you as soon as possible.
              </p>
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <div className="sticky top-24">
            <h3 className="text-2xl font-bold tracking-tight mb-6">Send a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
