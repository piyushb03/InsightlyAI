import { getProfile } from "@/app/actions/profile";
import ProfileForm from "./ProfileForm";
import AccountSettings from "./AccountSettings";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <Separator className="bg-white/5" />

      <section id="profile" className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This is how others will see you on the platform.
          </p>
        </div>
        <ProfileForm profile={profile} />
      </section>

      <Separator className="bg-white/5" />

      <section id="account" className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-red-400">Account Security</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your email, password, and account status.
          </p>
        </div>
        <AccountSettings profile={profile} />
      </section>
    </div>
  );
}
