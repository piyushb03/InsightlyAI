import { createClient } from "@/lib/supabase/client";

export async function uploadAvatarFile(file, userId) {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}-${Math.random()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}
