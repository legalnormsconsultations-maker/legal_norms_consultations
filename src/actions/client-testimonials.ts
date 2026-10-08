"use server";

import { ClientTestimonialsRepository } from "@/repositories/client-testimonials-repository";
import { revalidatePath } from "next/cache";

type TestimonialData = {
  clientName: string;
  occupation?: string | null;
  organization?: string | null;
  profilePicUrl?: string | null;
  rating: number;
  review: string;
  sortOrder: number;
  isActive: boolean;
};

export async function createClientTestimonial(data: TestimonialData) {
  if (!data.clientName) {
    throw new Error("Client name is required");
  }
  if (!data.review) {
    throw new Error("Review text is required");
  }

  const result = await ClientTestimonialsRepository.createTestimonial({
    clientName: data.clientName,
    occupation: data.occupation || null,
    organization: data.organization || null,
    profilePicUrl: data.profilePicUrl || null,
    rating: data.rating,
    review: data.review,
    sortOrder: data.sortOrder,
    isActive: data.isActive,
  });

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return result;
}

export async function updateClientTestimonial(id: string, data: TestimonialData) {
  if (!data.clientName) {
    throw new Error("Client name is required");
  }
  if (!data.review) {
    throw new Error("Review text is required");
  }

  const result = await ClientTestimonialsRepository.updateTestimonial(id, {
    clientName: data.clientName,
    occupation: data.occupation || null,
    organization: data.organization || null,
    profilePicUrl: data.profilePicUrl || null,
    rating: data.rating,
    review: data.review,
    sortOrder: data.sortOrder,
    isActive: data.isActive,
  });

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return result;
}

export async function deleteClientTestimonial(id: string) {
  await ClientTestimonialsRepository.deleteTestimonial(id);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
