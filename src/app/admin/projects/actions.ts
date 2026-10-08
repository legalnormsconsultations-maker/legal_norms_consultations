"use server";

import { PortfolioProjectsRepository } from "@/repositories/portfolio-projects-repository";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { portfolioProjects } from "@/db/schema";

export async function saveProjectAction(data: typeof portfolioProjects.$inferInsert) {
  const user = await getCurrentUser();
  if (!user || !user.roles.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    if (data.id) {
      // update
      await PortfolioProjectsRepository.updateProject(data.id, data);
    } else {
      // create
      await PortfolioProjectsRepository.createProject(data);
    }
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving project:", error);
    return { success: false, error: error.message || "Failed to save project" };
  }
}

export async function deleteProjectAction(id: string) {
  const user = await getCurrentUser();
  if (!user || !user.roles.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await PortfolioProjectsRepository.deleteProject(id);
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { success: false, error: error.message || "Failed to delete project" };
  }
}
