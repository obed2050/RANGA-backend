import { useState, useEffect, useRef } from "react";
import {
  FiPlus, FiEdit2, FiTrash2, FiPackage, FiDollarSign,
  FiX, FiCheck, FiUser, FiPhone, FiMapPin, FiCamera, FiUpload,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getMyShop, createShop, updateShop,
  getProducts, createProduct, updateProduct, deleteProduct,
  getCategories,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const EMPTY_FORM = { name: "", price: "", images: [], description: "", categoryId: "" };

const ImageCapture = ({ value, onChange }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [preview, setPreview] = useState(value || "");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large. Max 5MB.");
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); onChange(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleUrl = (e) => { setPreview(e.target.value); onChange(e.target.value); };
  const clear = () => { setPreview(""); onChange(""); };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
      {preview && (
        <div className="relative w-full h-40 mb-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img src={preview} alt="Preview" className="w-full h-full object-contain" onError={clear} />
          <button type="button" onClick={clear} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"><FiX size={13} /></button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex items-center justify-center gap-2 border-2 border-dashed border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl py-3 text-sm font-medium transition">
          <FiCamera size={16} /> Take Photo
        </button>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl py-3 text-sm font-medium transition">
          <FiUpload size={16} /> Upload
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <input type="url" value={preview.startsWith("data:") ? "" : preview} onChange={handleUrl} placeholder="Or paste image URL" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
    </div>
  );
};

export default function SellerDashboard() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [shopForm, setShopForm] = useState({ name: "", description: "", location: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showShopForm, setShowShopForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500";

  useEffect(() => {
    const init = async () => {
      try {
        const [shopRes, catRes] = await Promise.all([getMyShop(), getCategories()]);
        setShop(shopRes.data);
        setShopForm({ name: shopRes.data.name, description: shopRes.data.description || "", location: shopRes.data.location || "", phone: shopRes.data.phone || "" });
        setCategories(catRes.data || []);
        const prodRes = await getProducts({ shopId: shopRes.data.id });
        setProducts(prodRes.data?.data || prodRes.data || []);
      } catch {
        setShowShopForm(true);
        try {
          const catRes = await getCategories();
          setCategories(catRes.data || []);
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const saveShop = async (e) => {
    e.preventDefault();
    if (!shopForm.name) return toast.error("Shop name is required");
    setSaving(true);
    try {
      if (shop) {
        const res = await updateShop(shopForm);
        setShop(res.data);
        toast.success("Shop updated!");
      } else {
        const res = await createShop(shopForm);
        setShop(res.data);
        toast.success("Shop created!");
      }
      setShowShopForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save shop");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error("Name and price are required");
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), images: form.images ? [form.images] : [] };
      if (editId) {
        const res = await updateProduct(editId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editId ? { ...p, ...res.data } : p)));
        toast.success("Product updated!");
      } else {
        const res = await createProduct(payload);
        setProducts((prev) => [res.data, ...prev]);
        toast.success("Product added!");
      }
      setForm(EMPTY_FORM); setEditId(null); setShowForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name || p.title, price: p.price, images: Array.isArray(p.images) ? p.images[0] : p.images || "", description: p.description || "", categoryId: p.categoryId || "" });
    setEditId(p.id || p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* No shop yet */}
      {!shop && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-orange-800 dark:text-orange-300">You don't have a shop yet!</p>
            <p className="text-orange-600 dark:text-orange-400 text-xs mt-1">Create your shop to start adding products.</p>
          </div>
          <button onClick={() => setShowShopForm(true)} className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium">
            Create Shop
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name}</p>
          {shop && <p className="text-yellow-600 text-sm font-medium mt-0.5">🏪 {shop.name}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setShowShopForm(!showShopForm); setShowForm(false); }} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition text-sm">
            <FiUser size={14} /> {shop ? "Edit Shop" : "Create Shop"}
          </button>
          {shop && (
            <button onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditId(null); setShowShopForm(false); }} className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-yellow-600 transition">
              {showForm ? <FiX /> : <FiPlus />} {showForm ? "Cancel" : "Add Product"}
            </button>
          )}
        </div>
      </div>

      {/* Shop Form */}
      {showShopForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6 border border-yellow-100 dark:border-yellow-900/30">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">🏪 {shop ? "Edit Shop" : "Create Shop"}</h2>
          <form onSubmit={saveShop} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
              <input type="text" value={shopForm.name} onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })} placeholder="My Shop" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="tel" value={shopForm.phone} onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })} placeholder="0780000000" className={`${inputClass} pl-9`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative"><FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" value={shopForm.location} onChange={(e) => setShopForm({ ...shopForm, location: e.target.value })} placeholder="Kigali, Rwanda" className={`${inputClass} pl-9`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={shopForm.description} onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })} placeholder="About your shop" className={inputClass} />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="bg-yellow-500 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-yellow-600 transition disabled:opacity-60">
                {saving ? "Saving..." : shop ? "Update Shop" : "Create Shop"}
              </button>
              <button type="button" onClick={() => setShowShopForm(false)} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: products.length, icon: FiPackage, color: "bg-yellow-50 text-yellow-600" },
          { label: "Total Value", value: `$${products.reduce((s, p) => s + Number(p.price), 0).toFixed(0)}`, icon: FiDollarSign, color: "bg-green-50 text-green-600" },
          { label: "Active", value: products.filter((p) => p.status === "available").length, icon: FiCheck, color: "bg-purple-50 text-purple-600" },
          { label: "Out of Stock", value: products.filter((p) => p.status === "out_of_stock").length, icon: FiPackage, color: "bg-orange-50 text-orange-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className={`${color} p-3 rounded-xl`}><Icon size={18} /></div>
            <div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Form */}
      {showForm && shop && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5">{editId ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone 15 Pro" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" min="0" step="0.01" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock || ""} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" min="0" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short product description" className={inputClass} />
            </div>
            <ImageCapture value={typeof form.images === "string" ? form.images : (form.images?.[0] || "")} onChange={(val) => setForm({ ...form, images: val })} />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="bg-yellow-500 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-yellow-600 transition disabled:opacity-60">
                {saving ? "Saving..." : editId ? "Update" : "Add Product"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditId(null); }} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-white">My Products ({products.length})</h2>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FiPackage size={48} className="mx-auto mb-3 text-gray-300" />
            <p>{shop ? "No products yet. Add your first product!" : "Create a shop first to add products."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Price</th>
                  <th className="px-5 py-3 text-left">Stock</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => {
                  const pid = p.id || p._id;
                  const name = p.name || p.title;
                  const img = Array.isArray(p.images) ? p.images[0] : p.images || p.image;
                  return (
                    <tr key={pid} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={img || `https://picsum.photos/seed/${pid}/80/80`} alt={name} className="w-12 h-12 object-cover rounded-lg" onError={(e) => { e.target.src = `https://picsum.photos/seed/${pid}/80/80`; }} />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white line-clamp-1">{name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">{p.category?.name || p.category || "—"}</span></td>
                      <td className="px-5 py-4 font-bold text-yellow-600">${Number(p.price).toFixed(2)}</td>
                      <td className="px-5 py-4 text-gray-600">{p.stock ?? "—"}</td>
                      <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-full ${p.status === "available" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{p.status || "available"}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><FiEdit2 size={14} /></button>
                          <button onClick={() => handleDelete(pid)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
