import { useState, useEffect } from "react";
import { FiUsers, FiPackage, FiShoppingBag, FiTrendingUp, FiTrash2, FiShield, FiLogOut, FiRefreshCw } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminGetUsers, adminDeleteUser, adminGetProducts, adminDeleteProduct, adminGetShops, adminDeleteShop } from "../services/api";
import Loader from "../components/Loader";

const TABS = ["Overview", "Abakoresha", "Ibicuruzwa", "Amasoko"];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [uRes, pRes, sRes] = await Promise.all([adminGetUsers(), adminGetProducts(), adminGetShops()]);
      setUsers(uRes.data || []);
      setProducts(pRes.data || []);
      setShops(sRes.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load data");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleLogout = () => { logout(); navigate("/"); toast.success("Wamaze gusohoka"); };

  const delUser = async (id) => {
    if (!confirm("Siba uyu mukoresha?")) return;
    try { await adminDeleteUser(id); setUsers((p) => p.filter((u) => u.id !== id)); toast.success("Umukoresha yasibwe"); }
    catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const delProduct = async (id) => {
    if (!confirm("Siba iki gicuruzwa?")) return;
    try { await adminDeleteProduct(id); setProducts((p) => p.filter((x) => x.id !== id)); toast.success("Igicuruzwa cyasibwe"); }
    catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const delShop = async (id) => {
    if (!confirm("Siba iyi duka?")) return;
    try { await adminDeleteShop(id); setShops((p) => p.filter((s) => s.id !== id)); toast.success("Iduka yasibwe"); }
    catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const filteredUsers = filterRole === "all" ? users : users.filter((u) => u.role === filterRole);
  const sellers = users.filter((u) => u.role === "seller");
  const buyers = users.filter((u) => u.role === "buyer");

  const stats = [
    { label: "Abakoresha Bose", value: users.length, icon: FiUsers, color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600", sub: `${sellers.length} sellers, ${buyers.length} buyers` },
    { label: "Ibicuruzwa", value: products.length, icon: FiPackage, color: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600", sub: "Total products" },
    { label: "Amasoko", value: shops.length, icon: FiShoppingBag, color: "bg-purple-50 dark:bg-purple-900/30 text-purple-600", sub: "Active shops" },
    { label: "Total Value", value: `$${products.reduce((s, p) => s + Number(p.price || 0), 0).toFixed(0)}`, icon: FiTrendingUp, color: "bg-green-50 dark:bg-green-900/30 text-green-600", sub: "Products value" },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-yellow-600 rounded-2xl p-6 mb-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center">
            <FiShield size={28} className="text-gray-900" />
          </div>
          <div>
            <p className="text-yellow-300 text-xs font-semibold uppercase tracking-widest mb-1">👑 Admin Panel</p>
            <h1 className="text-2xl font-extrabold">Murakaza neza, {user?.name}!</h1>
            <p className="text-gray-300 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchAll} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition text-sm">
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition text-sm">
            <FiLogOut /> Sohoka
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${color} p-2.5 rounded-xl`}><Icon size={18} /></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? "bg-white dark:bg-gray-700 shadow text-yellow-600" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Sellers Bashya</h3>
            <div className="space-y-3">
              {sellers.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-9 h-9 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 font-bold text-sm flex-shrink-0">{s.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{s.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.email}</p>
                  </div>
                  {s.phone && <a href={`https://wa.me/${s.phone.replace(/^0/, "250")}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600"><FaWhatsapp size={16} /></a>}
                </div>
              ))}
              {sellers.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Nta sellers</p>}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Ibicuruzwa Bishya</h3>
            <div className="space-y-3">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-9 h-9 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"><FiPackage size={16} className="text-yellow-500" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by {p.shop?.name || "—"}</p>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">${Number(p.price).toFixed(2)}</span>
                </div>
              ))}
              {products.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Nta products</p>}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "Abakoresha" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 dark:text-white">Abakoresha Bose ({filteredUsers.length})</h2>
            <div className="flex gap-2">
              {["all", "seller", "buyer", "admin"].map((r) => (
                <button key={r} onClick={() => setFilterRole(r)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition capitalize ${filterRole === r ? "bg-yellow-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                  {r === "all" ? "Bose" : r}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Umukoresha</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Telefoni</th>
                  <th className="px-5 py-3 text-left">Yinjiye</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 font-bold text-sm flex-shrink-0">{u.name.charAt(0)}</div>
                        <div><p className="font-medium text-gray-800 dark:text-white">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "seller" ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700" : u.role === "admin" ? "bg-red-50 dark:bg-red-900/30 text-red-700" : "bg-blue-50 dark:bg-blue-900/30 text-blue-700"}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{u.phone || "—"}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {u.phone && <a href={`https://wa.me/${u.phone.replace(/^0/, "250")}`} target="_blank" rel="noopener noreferrer" className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"><FaWhatsapp size={14} /></a>}
                        {u.id !== user?.id && <button onClick={() => delUser(u.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"><FiTrash2 size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <p className="text-center py-10 text-gray-400">Nta bakoresha</p>}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "Ibicuruzwa" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-white">Ibicuruzwa Byose ({products.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Igicuruzwa</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Shop</th>
                  <th className="px-5 py-3 text-left">Igiciro</th>
                  <th className="px-5 py-3 text-left">Stock</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{p.name}</td>
                    <td className="px-5 py-4"><span className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 text-xs px-2 py-1 rounded-full">{p.category?.name || "—"}</span></td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{p.shop?.name || "—"}</td>
                    <td className="px-5 py-4 font-bold text-yellow-600">${Number(p.price).toFixed(2)}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{p.stock ?? "—"}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => delProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"><FiTrash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p className="text-center py-10 text-gray-400">Nta products</p>}
          </div>
        </div>
      )}

      {/* Shops Tab */}
      {activeTab === "Amasoko" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-white">Amasoko Yose ({shops.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Iduka</th>
                  <th className="px-5 py-3 text-left">Owner</th>
                  <th className="px-5 py-3 text-left">Telefoni</th>
                  <th className="px-5 py-3 text-left">Location</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {shops.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{s.name}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{s.owner?.name || "—"}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{s.phone || "—"}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{s.location || "—"}</td>
                    <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-full ${s.isActive ? "bg-green-50 dark:bg-green-900/30 text-green-700" : "bg-red-50 dark:bg-red-900/30 text-red-700"}`}>{s.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="px-5 py-4">
                      <button onClick={() => delShop(s.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"><FiTrash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shops.length === 0 && <p className="text-center py-10 text-gray-400">Nta masoko</p>}
          </div>
        </div>
      )}
    </div>
  );
}
