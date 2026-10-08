"use server";

import { CompanyLocationsRepository } from "@/repositories/company-locations-repository";
import { revalidatePath } from "next/cache";

type LocationData = {
  officeName: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  googleMapsUrl?: string | null;
  isPrimary: boolean;
  isActive: boolean;
  sortOrder: number;
};

export async function createCompanyLocation(data: LocationData) {
  if (!data.officeName || !data.address) {
    throw new Error("Office name and address are required");
  }

  const result = await CompanyLocationsRepository.createLocation({
    ...data,
    phone: data.phone || null,
    email: data.email || null,
    googleMapsUrl: data.googleMapsUrl || null,
  });

  return result;
}

export async function updateCompanyLocation(id: string, data: LocationData) {
  if (!data.officeName || !data.address) {
    throw new Error("Office name and address are required");
  }

  const result = await CompanyLocationsRepository.updateLocation(id, {
    ...data,
    phone: data.phone || null,
    email: data.email || null,
    googleMapsUrl: data.googleMapsUrl || null,
  });

  return result;
}

export async function deleteCompanyLocation(id: string) {
  await CompanyLocationsRepository.deleteLocation(id);
}
