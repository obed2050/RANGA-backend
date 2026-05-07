import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { FiMapPin, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const LoginPrompt = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiLock size={22} className="text-yellow-600" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Injira Mbere!</h3>
          <p className="text-xs text-gray-500 mt-1">Ugomba gukora Login kugirango ubashe kuvugana na seller.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-600 text-sm hover:bg-gray-50 transition">
            Funga
          </button>
          <button
            onClick={() => { onClose(); navigate("/login"); }}
            className="flex-1 py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded mt-2" />
    </div>
  </div>
);

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  const pid = product.id || product._id;
  const title = product.title || product.name || '';
  const image = product.image || (Array.isArray(product.images) ? product.images[0] : null);

  const seller = (() => { try { return JSON.parse(localStorage.getItem("sellerProfile") || "{}"); } catch { return {}; } })();
  const phone = product.phone || seller.phone || product.seller?.phone || "0780000000";
  const whatsapp = product.whatsapp || seller.whatsapp || phone.replace(/^0/, "250");
  const sellerName = product.sellerName || product.seller?.name || seller.name || "Ranga Seller";
  const location = product.location || product.seller?.address || seller.address || "";

  const message = encodeURIComponent(
    `Muraho ${sellerName}! Ndashaka kumenya byinshi kuri: *${title}* — $${Number(product.price).toFixed(2)}`
  );

  const guard = (e, href) => {
    if (!isAuthenticated) { e.preventDefault(); setShowPrompt(true); }
    else if (href) window.open(href, "_blank");
  };

  return (
    <>
      {showPrompt && <LoginPrompt onClose={() => setShowPrompt(false)} />}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

        {/* Image */}
        <Link to={`/product/${pid}`} className="block overflow-hidden bg-gray-50" style={{ height: "200px" }}>
          <img
            src={image || `https://picsum.photos/seed/${pid}/400/300`}
            alt={title}
            loading="lazy"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${pid}/400/300`; }}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1 gap-1.5">

          <Link to={`/product/${pid}`}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white hover:text-yellow-600 transition leading-snug"
              style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {title}
            </h3>
          </Link>

          {/* Description ntoya */}
          {product.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-snug"
              style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {product.description}
            </p>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FiMapPin size={10} className="text-yellow-500 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* Amafaranga */}
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-gray-900 dark:text-white">${Number(product.price).toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${Number(product.originalPrice).toFixed(2)}</span>
            )}
            {product.discount && (
              <span className="text-xs font-bold text-red-500">-{product.discount}%</span>
            )}
          </div>

          {/* Buttons 2 */}
          <div className="flex gap-2 mt-auto pt-2">
            <button
              onClick={(e) => guard(e, `https://wa.me/${whatsapp}?text=${message}`)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-xs py-2 rounded-lg font-semibold transition-all"
            >
              <FaWhatsapp size={13} /> WhatsApp
            </button>
            <a
              href={isAuthenticated ? `tel:${phone}` : "#"}
              onClick={(e) => { if (!isAuthenticated) { e.preventDefault(); setShowPrompt(true); } }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white text-xs py-2 rounded-lg font-semibold transition-all"
            >
              <FaPhoneAlt size={11} /> Hamagara
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
