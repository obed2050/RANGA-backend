import { useState } from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiPhone, FiMail, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import logo from "../assets/logo.png";

const GISUBIZO_PHONE = "0734664252";
const GISUBIZO_WHATSAPP = "250734664252";
const GISUBIZO_EMAIL = "gisubizojeanclaude199@gmail.com";

// Contact modal ya Gisubizo Ltd
const ContactModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Gisubizo Ltd</h3>
          <p className="text-xs text-yellow-600 font-medium">Software Development Company</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiX size={18} />
        </button>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FiPhone size={16} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Telefoni</p>
            <p className="font-semibold text-gray-800">{GISUBIZO_PHONE}</p>
          </div>
          <a href={`tel:${GISUBIZO_PHONE}`} className="ml-auto bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition font-medium">
            Hamagara
          </a>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FaWhatsapp size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">WhatsApp</p>
            <p className="font-semibold text-gray-800">{GISUBIZO_PHONE}</p>
          </div>
          <a
            href={`https://wa.me/${GISUBIZO_WHATSAPP}?text=Muraho Gisubizo Ltd! Ndashaka amakuru y'ibikorwa byanyu.`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-600 transition font-medium"
          >
            WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FiMail size={16} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-semibold text-gray-800 text-xs truncate">{GISUBIZO_EMAIL}</p>
          </div>
          <a href={`mailto:${GISUBIZO_EMAIL}`} className="ml-auto bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 transition font-medium flex-shrink-0">
            Email
          </a>
        </div>
      </div>

      <button onClick={onClose} className="w-full py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm hover:bg-gray-50 transition">
        Funga
      </button>
    </div>
  </div>
);

export default function Footer() {
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={logo} alt="Ranga System" className="h-12 w-12 object-contain" />
              <h2 className="text-2xl font-extrabold text-white">
                Ranga<span className="text-yellow-500">System</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted marketplace for buying and selling quality products online.
            </p>
            <div className="flex gap-3 mt-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="bg-gray-700 p-2 rounded-full hover:bg-yellow-500 transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              {["Electronics", "Clothes", "Shoes", "Food", "Sports"].map((c) => (
                <li key={c}><Link to={`/?category=${c}`} className="hover:text-yellow-400 transition">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              {[["Login", "/login"], ["Register", "/register"], ["Cart", "/cart"], ["Orders", "/orders"], ["Seller Dashboard", "/dashboard"]].map(([label, path]) => (
                <li key={label}><Link to={path} className="hover:text-yellow-400 transition">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@rangasystem.com</li>
              <li>📞 +250 780 000 000</li>
              <li>🕐 Mon–Fri, 9am–6pm</li>
            </ul>
          </div>
        </div>

        {/* MADE BY GISUBIZO LTD */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Ranga System. All rights reserved.
            </p>

            {/* Gisubizo Ltd badge — clickable */}
            <button
              onClick={() => setShowContact(true)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-yellow-500 hover:text-gray-900 text-gray-300 px-4 py-2 rounded-full transition-all duration-300 group"
            >
              <span className="text-yellow-400 group-hover:text-gray-900 text-xs">⚡</span>
              <span className="text-xs font-semibold">Made by</span>
              <span className="text-xs font-extrabold text-yellow-400 group-hover:text-gray-900">GISUBIZO LTD</span>
              <span className="text-xs text-gray-500 group-hover:text-gray-700">— Kanda hano kutuvugisha</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
