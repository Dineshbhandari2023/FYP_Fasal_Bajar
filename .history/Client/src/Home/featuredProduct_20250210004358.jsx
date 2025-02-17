import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function FeaturedProducts() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="aspect-square relative mb-3">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">
                From ${product.price.toFixed(2)}/{product.unit}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
