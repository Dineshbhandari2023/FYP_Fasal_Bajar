import ProfileForm from "../ProfileForm";
import { SupplierLayout } from "../SupplierLayout";

export default function SupplierProfilePage() {
  return (
    <SupplierLayout profileComplete={false}>
      <div className="container max-w-4xl py-6">
        <ProfileForm />
      </div>
    </SupplierLayout>
  );
}
