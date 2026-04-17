"use client";

import { useState, useTransition } from "react";
import { User, Camera, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, uploadAvatar } from "@/app/actions/profile";
import { uploadAvatarFile } from "@/lib/supabase/storage";
import { toast } from "sonner";

export default function ProfileForm({ profile }) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await uploadAvatarFile(file, profile.id);
      await uploadAvatar(publicUrl);
      setAvatarUrl(publicUrl);
      toast.success("Avatar updated!");
    } catch (err) {
      toast.error("Failed to upload avatar");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated!");
      }
    });
  }

  return (
    <div className="glass-card glow-border p-6 md:p-8 space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-white/5 ring-2 ring-violet-500/20 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-white/20" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-violet-400 animate-spin" />
              </div>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 p-2 rounded-full bg-violet-600 text-white cursor-pointer hover:bg-violet-500 transition-colors shadow-lg shadow-black/40">
            <Camera className="h-4 w-4" />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUploading} />
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="font-semibold text-white">Profile Picture</h3>
          <p className="text-sm text-white/40 mt-1">
            JPG, GIF or PNG. Max size 2MB.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={profile?.full_name ?? ""}
              placeholder="e.g. John Doe"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              value={profile?.email ?? ""}
              disabled
              className="bg-white/5 border-white/10 opacity-60 cursor-not-allowed"
            />
            <p className="text-[10px] text-white/20 italic">Email can be changed in Account settings</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-white/30">
            Joined on {new Date(profile?.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <Button type="submit" disabled={isPending} className="bg-violet-600 hover:bg-violet-500 min-w-[120px]">
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving</>
            ) : (
              <><Check className="mr-2 h-4 w-4" /> Save Changes</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
