import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiTruck, FiShield, FiMapPin, FiPhone, FiUser, FiLock } from "react-icons/fi";
import { FaWhatsapp, FaPhoneAlt, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { getProductById } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const MOCK_PRODUCTS = {
  "1": { _id: "1", title: "Apple iPhone 15 Pro Max 256GB", price: 1199.99, rating: 4.8, category: "Electronics", image: "https://picsum.photos/seed/iphone/600/500", description: "The iPhone 15 Pro Max features a titanium design, A17 Pro chip, and a 48MP camera system. Experience the most powerful iPhone ever made with ProMotion display and all-day battery life." },
  "2": { _id: "2", title: "Nike Air Max 270 Running Shoes", price: 129.99, rating: 4.5, category: "Shoes", image: "https://picsum.photos/seed/shoes/600/500", description: "The Nike Air Max 270 delivers unrivaled, all-day comfort. The shoe's design draws inspiration from Air Max icons, featuring Nike's biggest heel Air unit yet." },
  "3": { _id: "3", title: "Samsung 65\" 4K QLED Smart TV", price: 899.99, rating: 4.7, category: "Electronics", image: "https://picsum.photos/seed/tv/600/500", description: "Experience stunning 4K QLED picture quality with Quantum Dot technology. Smart TV features include built-in streaming apps, voice control, and a sleek design." },
  "4": { _id: "4", title: "Men's Classic Fit Oxford Shirt", price: 39.99, rating: 4.3, category: "Clothes", image: "https://picsum.photos/seed/shirt/600/500", description: "A timeless classic fit Oxford shirt crafted from premium cotton. Perfect for both casual and semi-formal occasions." },
  "5": { _id: "5", title: "Organic Mixed Fruit Basket", price: 24.99, rating: 4.6, category: "Food", image: "https://picsum.photos/seed/fruit/600/500", description: "Fresh organic mixed fruit basket featuring seasonal fruits. Sourced directly from local farms for maximum freshness." },
  "6": { _id: "6", title: "Sony WH-1000XM5 Headphones", price: 349.99, rating: 4.9, category: "Electronics", image: "https://picsum.photos/seed/headphones/600/500", description: "Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones." },
};

const Stars = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className="text-yellow-400">
        {rating >= s ? <FaStar /> : rating >= s - 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
    ))}
    <span className="text-sm text-gray-500 ml-1">{rating} out of 5</span>
  </div>
);

const getSellerProfile = () => {
  try { return JSON.parse(localStorage.getItem("sellerProfile") || "{}"); }
  catch { return {}; }
};

// Login prompt modal
const LoginPrompt = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiLock size={28} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Injira Mbere!</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Ugomba gukora <strong>Login</strong> kugirango ubashe kubona nimero ya seller no kumuvugisha.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            Funga
          </button>
          <button
            onClick={() => { onClose(); navigate("/login"); }}
            className="flex-1 py-3 bg-yellow-500 text-white rounded-xl text-sm font-bold hover:bg-yellow-600 transition"
          >
            🔐 Injira / Login
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          Nta konti ufite?{" "}
          <button onClick={() => { onClose(); navigate("/register"); }} className="text-yellow-600 font-semibold hover:underline">
            Iyandikishe
          </button>
        </p>
      </div>
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch {
        setProduct(MOCK_PRODUCTS[id] || {
          _id: id, title: "Product", price: 99.99, rating: 4.5, category: "General",
          image: `https://picsum.photos/seed/${id}/600/500`,
          description: "A great product available at Ranga System marketplace."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const seller = product.seller || getSellerProfile();
  const sellerName = seller.name || product.sellerName || "Ranga System Seller";
  const sellerPhone = seller.phone || product.phone || "0780000000";
  const sellerWhatsapp = seller.whatsapp || product.whatsapp || sellerPhone.replace(/^0/, "250");
  const sellerAddress = seller.address || product.address || "Rwanda";
  const sellerDesc = seller.description || "";

  const message = encodeURIComponent(
    `Muraho ${sellerName}! Ndashaka kumenya byinshi kuri:\n*${product.title}*\nIngano: ${quantity}\nAgaciro: $${(Number(product.price) * quantity).toFixed(2)}`
  );

  const handleProtectedClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowPrompt(true);
    }
  };

  return (
    <>
      {showPrompt && <LoginPrompt onClose={() => setShowPrompt(false)} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-yellow-600 transition mb-6 text-sm">
          <FiArrowLeft /> Back to products
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gray-50 dark:bg-gray-700 p-8 flex items-center justify-center">
                <img
                  src={product.image || `https://picsum.photos/seed/${id}/600/500`}
                  alt={product.title}
                  className="max-h-80 w-full object-contain rounded-xl"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}/600/500`; }}
                />
              </div>

              <div className="p-6 flex flex-col gap-4">
                {product.category && (
                  <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full w-fit">
                    {product.category}
                  </span>
                )}
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
                <Stars rating={product.rating || 4.5} />
                <div className="text-3xl font-extrabold text-yellow-600">${Number(product.price).toFixed(2)}</div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{product.description}</p>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <FiMinus size={13} />
                    </button>
                    <span className="px-4 py-2 font-semibold text-gray-800 dark:text-white border-x border-gray-300 dark:border-gray-600">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <FiPlus size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <FiTruck className="text-green-500" /> Free shipping over $50
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <FiShield className="text-yellow-500" /> Secure checkout
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FiUser className="text-yellow-500" /> Umuntu Wamamaza
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 font-bold text-lg">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{sellerName}</p>
                  <p className="text-xs text-green-600 font-medium">✅ Verified Seller</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <FiPhone className="text-yellow-500 mt-0.5 flex-shrink-0" size={15} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Telefoni</p>
                    {isAuthenticated ? (
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{sellerPhone}</p>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <FiLock size={12} className="text-gray-400" />
                        <p className="text-xs text-gray-400 italic">Injira kugirango ubone</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <FiMapPin className="text-yellow-500 mt-0.5 flex-shrink-0" size={15} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Aderesi</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{sellerAddress}</p>
                  </div>
                </div>

                {sellerDesc && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ibisobanuro</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{sellerDesc}</p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 mb-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Igiciro cy'ibyo ushaka</p>
                <p className="text-2xl font-extrabold text-yellow-600">
                  ${(Number(product.price) * quantity).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">({quantity} × ${Number(product.price).toFixed(2)})</p>
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <a href={`https://wa.me/${sellerWhatsapp}?text=${message}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition">
                    <FaWhatsapp size={20} /> Vugana kuri WhatsApp
                  </a>
                  <a href={`tel:${sellerPhone}`}
                    className="flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
                    <FaPhoneAlt size={16} /> Hamagara Ubu
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button onClick={() => setShowPrompt(true)}
                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition">
                    <FaWhatsapp size={20} /> Vugana kuri WhatsApp
                  </button>
                  <button onClick={() => setShowPrompt(true)}
                    className="flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
                    <FaPhoneAlt size={16} /> Hamagara Ubu
                  </button>
                  <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3">
                    <FiLock size={14} className="text-orange-500 flex-shrink-0" />
                    <p className="text-xs text-orange-700 dark:text-orange-400">
                      <strong>Login</strong> kugirango ubashe kubona nimero no kuvugana na seller.
                    </p>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-400 text-center mt-3">
                📍 Umuguzi n'umucuruzi bavugana directly
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
