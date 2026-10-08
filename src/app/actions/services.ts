"use server";

import { ServicesRepository, ServiceInsert } from "@/repositories/services-repository";
import { revalidatePath } from "next/cache";

export async function createServiceAction(prevState: any, formData: FormData) {
  try {
    const data: ServiceInsert = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string || undefined,
      subcategory: formData.get("subcategory") as string || undefined,
      description: formData.get("description") as string || undefined,
      status: (formData.get("status") as any) || "Published",
    };

    await ServicesRepository.createService(data);
    
    revalidatePath("/");
    revalidatePath("/admin/services");
    
    return { success: true, message: "Service created successfully!" };
  } catch (error: any) {
    console.error("Failed to create service:", error);
    return { success: false, message: error.message || "Failed to create service." };
  }
}

export async function updateServiceAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    
    const data: Partial<ServiceInsert> = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string || undefined,
      subcategory: formData.get("subcategory") as string || undefined,
      description: formData.get("description") as string || undefined,
      status: (formData.get("status") as any) || "Published",
    };

    await ServicesRepository.updateService(id, data);
    
    revalidatePath("/");
    revalidatePath("/admin/services");
    
    return { success: true, message: "Service updated successfully!" };
  } catch (error: any) {
    console.error("Failed to update service:", error);
    return { success: false, message: error.message || "Failed to update service." };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    await ServicesRepository.deleteService(id);
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete service:", error);
    return { success: false };
  }
}
