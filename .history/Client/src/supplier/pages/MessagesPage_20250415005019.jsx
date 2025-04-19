import { SupplierLayout } from "../SupplierLayout";
import { MessageCenter } from "../messages/message-center";

export default function MessagesPage() {
  return (
    <SupplierLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-gray-500">
          Communicate with farmers and buyers to coordinate pickups and
          deliveries.
        </p>

        <MessageCenter />
      </div>
    </SupplierLayout>
  );
}
