"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleAdminRole(userId: string, makeAdmin: boolean) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.roles.includes("SUPER_ADMIN")) {
    return { error: "Unauthorized. Only Super Admins can manage roles." };
  }

  // Fetch target user
  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!targetUser) {
    return { error: "User not found." };
  }

  if (targetUser.email === "legalnormsconsultations@gmail.com") {
    return { error: "Cannot modify the owner's roles." };
  }

  let newRoles = Array.isArray(targetUser.roles) 
    ? targetUser.roles.filter((r) => typeof r === "string") 
    : ["USER"];
    
  if (makeAdmin) {
    if (!newRoles.includes("ADMIN")) {
      newRoles.push("ADMIN");
    }
  } else {
    newRoles = newRoles.filter((role) => role !== "ADMIN");
  }

  await db.update(users)
    .set({ roles: newRoles })
    .where(eq(users.id, userId));

  revalidatePath("/admin/team");
  return { success: true };
}

export async function editUserAction(userId: string, data: { firstName: string, lastName: string, email: string }) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.roles.includes("SUPER_ADMIN")) {
    return { error: "Unauthorized. Only Super Admins can manage users." };
  }

  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!targetUser) return { error: "User not found." };
  
  if (targetUser.email === "legalnormsconsultations@gmail.com" && currentUser.email !== "legalnormsconsultations@gmail.com") {
    return { error: "Cannot modify the owner's details." };
  }

  await db.update(users)
    .set({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/team");
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.roles.includes("SUPER_ADMIN")) {
    return { error: "Unauthorized. Only Super Admins can delete users." };
  }

  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!targetUser) return { error: "User not found." };

  if (targetUser.email === "legalnormsconsultations@gmail.com") {
    return { error: "Cannot delete the owner." };
  }
  
  if (targetUser.id === currentUser.id) {
    return { error: "Cannot delete yourself." };
  }

  await db.delete(users).where(eq(users.id, userId));

  revalidatePath("/admin/team");
  return { success: true };
}
