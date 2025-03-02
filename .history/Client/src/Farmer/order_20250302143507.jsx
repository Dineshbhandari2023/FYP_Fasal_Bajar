import React from 'react'

const order = () => {
 
    
        const orders = [
          { id: '12345', product: 'Organic Tomatoes', quantity: 10, price: '$29.90', status: 'Completed', date: '2025-03-01' },
          { id: '12346', product: 'Fresh Carrots', quantity: 5, price: '$9.95', status: 'Pending', date: '2025-03-02' },
        ];
      
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.product}</td>
                    <td className="p-2">{order.quantity}</td>
                    <td className="p-2">{order.price}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      };
  )
}

export default order
