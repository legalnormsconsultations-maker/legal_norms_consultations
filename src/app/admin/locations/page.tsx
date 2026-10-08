import { CompanyLocationsRepository } from "@/repositories/company-locations-repository";
import { LocationsClient } from "./locations-client";

export default async function AdminLocationsPage() {
  const locations = await CompanyLocationsRepository.getAllLocations();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Company Locations</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your office locations, contact details, and addresses shown on the Contact page.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl p-6">
        <LocationsClient initialLocations={locations} />
      </div>
    </div>
  );
}
