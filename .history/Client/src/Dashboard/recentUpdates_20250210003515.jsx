import { Package, ShoppingBag, MessageSquare } from "lucide-react"

interface Update {
  id: number
  type: "delivery" | "product" | "message"
  message: string
  time: string
}

interface RecentUpdatesProps {
  updates: Update[]
}

export default function RecentUpdates({ updates }: RecentUpdatesProps) {
  const getIcon = (type: Update["type"]) => {
    switch (type) {
      case "delivery":
        return <Package className="text-green-600" size={20} />
      case "product":
        return <ShoppingBag className="text-blue-600" size={20} />
      case "message":
        return <MessageSquare className="text-purple-600" size={20} />
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="flex items-start space-x-3">
            {getIcon(update.type)}
            <div>
              <p className="text-sm">{update.message}</p>
              <p className="text-xs text-gray-500">{update.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

