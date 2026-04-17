"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching profile:", error);
    return null;
  }

  return {
    ...data,
    email: user.email,
    created_at: user.created_at,
  };
}

export async function updateProfile(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const full_name = formData.get("full_name");
  const currency = formData.get("currency");

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name,
      currency,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function uploadAvatar(url) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      avatar_url: url,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}
