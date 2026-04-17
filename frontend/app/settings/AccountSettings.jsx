"use client";

import { useTransition } from "react";
import { KeyRound, Mail, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword, updateEmail } from "@/app/actions/auth";
import { toast } from "sonner";

export default function AccountSettings({ profile }) {
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [isEmailPending, startEmailTransition] = useTransition();

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startPasswordTransition(async () => {
      const result = await updatePassword(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password updated successfully!");
        e.target.reset();
      }
    });
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startEmailTransition(async () => {
      const result = await updateEmail(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Password Reset */}
      <div className="glass-card glow-border p-6 md:p-8">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="h-5 w-5 text-violet-400" />
            <h3 className="font-semibold">Update Password</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <Button type="submit" disabled={isPasswordPending} variant="outline" className="border-white/10 hover:bg-white/5">
            {isPasswordPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Change Password
          </Button>
        </form>
      </div>

      {/* Email Update */}
      <div className="glass-card glow-border p-6 md:p-8">
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-5 w-5 text-violet-400" />
            <h3 className="font-semibold">Update Email</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">New Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={profile?.email}
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <Button type="submit" disabled={isEmailPending} variant="outline" className="border-white/10 hover:bg-white/5">
            {isEmailPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Update Email
          </Button>
          <p className="text-[10px] text-white/20 italic">
            Note: You will need to confirm the change on both your old and new email addresses.
          </p>
        </form>
      </div>
    </div>
  );
}
