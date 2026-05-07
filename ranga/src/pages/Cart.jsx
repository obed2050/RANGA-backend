import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    toast.success("Order placed successfully! 🎉");
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/" className="bg-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-yellow-600 transition mb-6 text-sm">
        <FiArrowLeft /> Continue Shopping
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Shopping Cart ({cartItems.length} items)</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const iid = item.id || item._id;
            const title = item.title || item.name || '';
            const image = item.image || (Array.isArray(item.images) ? item.images[0] : null);
            return (
            <div key={iid} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex gap-4 items-center">
              <img
                src={image || `https://picsum.photos/seed/${iid}/200/200`}
                alt={title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${iid}/200/200`; }}
              />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${iid}`} className="font-semibold text-gray-800 dark:text-white hover:text-yellow-600 transition text-sm line-clamp-2">
                  {title}
                </Link>
                <p className="text-yellow-600 font-bold mt-1">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => removeFromCart(iid)} className="text-gray-400 hover:text-red-500 transition">
                  <FiTrash2 size={16} />
                </button>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(iid, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <FiMinus size={12} />
                  </button>
                  <span className="px-3 py-1 text-sm font-semibold border-x border-gray-200 dark:border-gray-600 dark:text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(iid, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <FiPlus size={12} />
                  </button>
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">${(Number(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            </div>
            );
          })}
        </div>
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span className={totalPrice >= 50 ? "text-green-600 font-medium" : ""}>
                  {totalPrice >= 50 ? "FREE" : "$9.99"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Tax (8%)</span><span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t dark:border-gray-600 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                <span>Total</span>
                <span className="text-yellow-600">${(totalPrice + (totalPrice >= 50 ? 0 : 9.99) + totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>
            {totalPrice < 50 && (
              <p className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 mt-3">
                Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
              </p>
            )}
            <button onClick={handleCheckout} className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition mt-4">Proceed to Checkout</button>
            <button onClick={clearCart} className="w-full text-gray-500 text-sm mt-2 hover:text-red-500 transition">Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
