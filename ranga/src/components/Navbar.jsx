import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiLogOut, FiShield, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useDarkMode } from "../context/DarkModeContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { dark, toggle } = useDarkMode();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      {/* Top bar */}
      <div className="bg-yellow-500 text-white text-xs py-1 text-center font-medium">
        Free shipping on orders over $50! Shop now at Ranga System
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          <img src={logo} alt="Ranga System" className="h-10 w-10 object-contain" />
          <span className="text-xl font-extrabold text-yellow-600 tracking-tight hidden sm:block">
            Ranga<span className="text-gray-800 dark:text-white">System</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for anything..."
            className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-5 py-2 rounded-r-full hover:bg-yellow-600 transition"
          >
            <FiSearch size={18} />
          </button>
        </form>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Hi, {user?.name?.split(" ")[0]}</span>
              {user?.role === "admin" && (
                <Link to="/admin" className="flex items-center gap-1 text-sm bg-yellow-500 text-white px-3 py-1.5 rounded-full hover:bg-yellow-600 font-medium transition">
                  <FiShield size={13} /> Admin
                </Link>
              )}
              {user?.role === "seller" && (
                <Link to="/dashboard" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition">
                  Dashboard
                </Link>
              )}
              {user?.role !== "admin" && (
                <Link to="/orders" className="text-sm text-gray-700 hover:text-yellow-600 transition">Orders</Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 hover:text-yellow-600 transition">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-600 transition">Login</Link>
              <Link to="/register" className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-full hover:bg-yellow-600 transition font-medium">
                Register
              </Link>
            </>
          )}
          <Link to="/cart" className="relative">
            <FiShoppingCart size={24} className="text-gray-700 dark:text-gray-200 hover:text-yellow-600 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          {/* Dark mode toggle */}
          <button onClick={toggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="Toggle dark mode">
            {dark ? <FiSun size={18} className="text-yellow-400" /> : <FiMoon size={18} className="text-gray-600" />}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggle} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            {dark ? <FiSun size={18} className="text-yellow-400" /> : <FiMoon size={18} className="text-gray-600 dark:text-gray-300" />}
          </button>
          <Link to="/cart" className="relative">
            <FiShoppingCart size={22} className="text-gray-700 dark:text-gray-200" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="dark:text-white">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 px-4 py-3 flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Hi, {user?.name}</span>
              {user?.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-yellow-600 font-medium">👑 Admin Panel</Link>
              )}
              {user?.role === "seller" && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-yellow-600">Dashboard</Link>
              )}
              {user?.role !== "admin" && (
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 dark:text-gray-300">Orders</Link>
              )}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-sm text-left text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 dark:text-gray-300">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-yellow-600 font-medium">Register</Link>
            </>
          )}
        </div>
      )}

      {/* Category Nav */}
      <div className="hidden md:flex bg-green-600 border-t border-green-700 px-4 gap-1 max-w-full py-1.5">
        <div className="max-w-7xl mx-auto flex gap-1 w-full">
          {["Electronics", "Clothes", "Shoes", "Food", "Sports", "Home & Garden", "Toys"].map((cat) => (
            <Link
              key={cat}
              to={`/?category=${cat}`}
              className="text-white text-sm px-4 py-1.5 rounded hover:bg-green-700 transition whitespace-nowrap font-medium"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
