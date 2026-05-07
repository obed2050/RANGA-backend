import { useState, useEffect } from "react";
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";
import { getMyOrders } from "../services/api";
import Loader from "../components/Loader";

const MOCK_ORDERS = [
  { _id: "ord1", createdAt: "2024-01-15", status: "Delivered", total: 1329.98, items: [{ title: "Apple iPhone 15 Pro Max", price: 1199.99, quantity: 1, image: "https://picsum.photos/seed/iphone/80/80" }, { title: "Nike Air Max 270", price: 129.99, quantity: 1, image: "https://picsum.photos/seed/shoes/80/80" }] },
  { _id: "ord2", createdAt: "2024-01-20", status: "Shipped", total: 349.99, items: [{ title: "Sony WH-1000XM5 Headphones", price: 349.99, quantity: 1, image: "https://picsum.photos/seed/headphones/80/80" }] },
  { _id: "ord3", createdAt: "2024-01-25", status: "Pending", total: 64.98, items: [{ title: "Men's Oxford Shirt", price: 39.99, quantity: 1, image: "https://picsum.photos/seed/shirt/80/80" }, { title: "Organic Fruit Basket", price: 24.99, quantity: 1, image: "https://picsum.photos/seed/fruit/80/80" }] },
];

const STATUS_CONFIG = {
  pending:   { icon: FiClock,       color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400", label: "Pending" },
  confirmed: { icon: FiClock,       color: "bg-blue-100 text-blue-700",   dot: "bg-blue-400",   label: "Confirmed" },
  shipped:   { icon: FiTruck,       color: "bg-blue-100 text-blue-700",   dot: "bg-blue-400",   label: "Shipped" },
  delivered: { icon: FiCheckCircle, color: "bg-green-100 text-green-700", dot: "bg-green-400",  label: "Delivered" },
  cancelled: { icon: FiClock,       color: "bg-red-100 text-red-700",     dot: "bg-red-400",    label: "Cancelled" },
  // legacy mock
  Pending:   { icon: FiClock,       color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400", label: "Pending" },
  Shipped:   { icon: FiTruck,       color: "bg-blue-100 text-blue-700",   dot: "bg-blue-400",   label: "Shipped" },
  Delivered: { icon: FiCheckCircle, color: "bg-green-100 text-green-700", dot: "bg-green-400",  label: "Delivered" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(Array.isArray(res.data) && res.data.length ? res.data : MOCK_ORDERS);
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const Icon = config.icon;
            const statusLabel = config.label || order.status;
            return (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Order Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <FiPackage className="text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${config.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                      <Icon size={12} />
                      {statusLabel}
                    </span>
                    <span className="font-bold text-primary">${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image || `https://picsum.photos/seed/${idx}/80/80`}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded-lg"
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/${idx}/80/80`; }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{item.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="px-6 pb-4">
                  <div className="flex items-center gap-2">
                    {["pending", "shipped", "delivered"].map((step, idx) => {
                      const steps = ["pending", "shipped", "delivered"];
                      const currentIdx = steps.indexOf((order.status || '').toLowerCase());
                      const isActive = idx <= currentIdx;
                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isActive ? "bg-primary" : "bg-gray-200"}`}></div>
                          {idx < 2 && <div className={`flex-1 h-0.5 ${idx < currentIdx ? "bg-primary" : "bg-gray-200"}`}></div>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    {["Pending", "Shipped", "Delivered"].map((step) => (
                      <span key={step} className="text-xs text-gray-400">{step}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
