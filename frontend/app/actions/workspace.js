"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { flaskFetch, getAuthHeaders } from "@/lib/api";

export async function getUploads() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";

  try {
    const res = await flaskFetch("/api/uploads", {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function deleteUpload(uploadId) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";

  try {
    const res = await flaskFetch(`/api/uploads/${uploadId}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    
    if (res.ok) {
      revalidatePath("/workspace");
      revalidatePath("/dashboard");
      return { success: true };
    }
    
    const data = await res.json();
    return { error: data.error ?? "Failed to delete" };
  } catch (err) {
    return { error: "Network error" };
  }
}
