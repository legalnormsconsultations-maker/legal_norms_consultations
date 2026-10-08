"use server";

import { TrustedBrandsRepository } from "@/repositories/trusted-brands-repository";
import { revalidatePath } from "next/cache";

export async function createTrustedBrand(data: { name: string, logoUrl?: string | null, iconName?: string | null, sortOrder: number, isActive: boolean }) {
  if (!data.name) {
    throw new Error("Name is required");
  }

  const result = await TrustedBrandsRepository.createBrand({
    name: data.name,
    logoUrl: data.logoUrl || null,
    iconName: data.iconName || null,
    sortOrder: data.sortOrder,
    isActive: data.isActive,
  });

  revalidatePath("/");
  revalidatePath("/admin/brands");
  return result;
}

export async function updateTrustedBrand(id: string, data: { name: string, logoUrl?: string | null, iconName?: string | null, sortOrder: number, isActive: boolean }) {
  if (!data.name) {
    throw new Error("Name is required");
  }

  const result = await TrustedBrandsRepository.updateBrand(id, {
    name: data.name,
    logoUrl: data.logoUrl || null,
    iconName: data.iconName || null,
    sortOrder: data.sortOrder,
    isActive: data.isActive,
  });

  revalidatePath("/");
  revalidatePath("/admin/brands");
  return result;
}

export async function deleteTrustedBrand(id: string) {
  await TrustedBrandsRepository.deleteBrand(id);
  revalidatePath("/");
  revalidatePath("/admin/brands");
}
