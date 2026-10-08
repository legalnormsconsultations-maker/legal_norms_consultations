import { TrustedBrandsRepository } from "@/repositories/trusted-brands-repository";
import { BrandsClient } from "./brands-client";
import { Plus } from "lucide-react";

export default async function AdminBrandsPage() {
  const brands = await TrustedBrandsRepository.getAllBrands();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Trusted Brands</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage the organizations, hospitals, and clients shown on the homepage.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl p-6">
        <BrandsClient initialBrands={brands} />
      </div>
    </div>
  );
}
