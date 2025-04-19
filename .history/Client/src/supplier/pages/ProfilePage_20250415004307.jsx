import { ProfileForm } from "../components/profile-form";
import { SupplierLayout } from "../components/supplier-layout";

export default function ProfilePage() {
  return (
    <SupplierLayout profileComplete={false}>
      <div className="container max-w-4xl py-6">
        <ProfileForm />
      </div>
    </SupplierLayout>
  );
}
