"use server";

import { revalidatePath } from "next/cache";
import { ArticlesRepository, ArticleCreateSchema } from "@/repositories/articles-repository";
import { getCurrentUser } from "@/lib/auth";

export async function createArticleAction(prevState: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.roles.includes("ADMIN")) {
      return { success: false, error: "Unauthorized" };
    }

    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      type: formData.get("type") as any,
      status: formData.get("status") as any,
      industry: formData.get("industry") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
    };

    const newArticle = await ArticlesRepository.createArticle(rawData);

    revalidatePath("/admin/articles");
    
    return { success: true, articleId: newArticle.id };
  } catch (error: any) {
    console.error("Error creating article:", error);
    return { success: false, error: error.message || "Failed to create article" };
  }
}

export async function updateArticleAction(articleId: string, prevState: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.roles.includes("ADMIN")) {
      return { success: false, error: "Unauthorized" };
    }

    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      type: formData.get("type") as any,
      status: formData.get("status") as any,
      industry: formData.get("industry") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
    };

    await ArticlesRepository.updateArticle(articleId, rawData);
    revalidatePath("/admin/articles");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating article:", error);
    return { success: false, error: error.message || "Failed to update article" };
  }
}

export async function deleteArticleAction(articleId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.roles.includes("ADMIN")) {
      return { success: false, error: "Unauthorized" };
    }
    
    await ArticlesRepository.deleteArticle(articleId);
    revalidatePath("/admin/articles");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting article:", error);
    return { success: false, error: error.message || "Failed to delete article" };
  }
}
