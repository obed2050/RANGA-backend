import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiArrowRight, FiTrendingUp, FiShield, FiTruck } from "react-icons/fi";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { getProducts } from "../services/api";

const CATEGORIES = [
  { name: "Electronics", icon: "💻", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Clothes",     icon: "👗", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { name: "Shoes",       icon: "👟", color: "bg-green-50 text-green-700 border-green-200" },
  { name: "Food",        icon: "🍎", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { name: "Sports",      icon: "⚽", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Home & Garden", icon: "🏡", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { name: "Toys",        icon: "🧸", color: "bg-red-50 text-red-700 border-red-200" },
  { name: "Books",       icon: "📚", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

const MOCK_PRODUCTS = [
  { _id: "1",  title: "Apple iPhone 15 Pro Max 256GB",       price: 1199.99, originalPrice: 1399.99, discount: 14, rating: 4.9, reviews: 12847, category: "Electronics", badge: "Best Seller", image: "https://picsum.photos/seed/iphone15/400/400" },
  { _id: "2",  title: "Nike Air Max 270 Running Shoes",       price: 129.99,  originalPrice: 159.99,  discount: 19, rating: 4.5, reviews: 3421,  category: "Shoes",        image: "https://picsum.photos/seed/nikeair/400/400" },
  { _id: "3",  title: "Samsung 65\" 4K QLED Smart TV",        price: 899.99,  originalPrice: 1099.99, discount: 18, rating: 4.7, reviews: 5632,  category: "Electronics", badge: "Best Seller", image: "https://picsum.photos/seed/samsungtv/400/400" },
  { _id: "4",  title: "Men's Classic Fit Oxford Shirt",       price: 39.99,   originalPrice: 59.99,   discount: 33, rating: 4.3, reviews: 892,   category: "Clothes",      image: "https://picsum.photos/seed/oxfordshirt/400/400" },
  { _id: "5",  title: "Organic Mixed Fruit Basket Premium",   price: 24.99,   rating: 4.6, reviews: 2103,  category: "Food",         image: "https://picsum.photos/seed/fruitbasket/400/400" },
  { _id: "6",  title: "Sony WH-1000XM5 Noise Cancelling Headphones", price: 349.99, originalPrice: 399.99, discount: 13, rating: 4.9, reviews: 8901, category: "Electronics", badge: "Best Seller", image: "https://picsum.photos/seed/sonywh/400/400" },
  { _id: "7",  title: "Adidas Ultraboost 22 Running Sneakers", price: 179.99, originalPrice: 219.99, discount: 18, rating: 4.4, reviews: 1567,  category: "Shoes",        image: "https://picsum.photos/seed/ultraboost/400/400" },
  { _id: "8",  title: "Women's Summer Floral Maxi Dress",     price: 49.99,   originalPrice: 79.99,   discount: 38, rating: 4.2, reviews: 743,   category: "Clothes",      image: "https://picsum.photos/seed/floraldress/400/400" },
  { _id: "9",  title: "MacBook Pro 14\" M3 Chip 512GB",       price: 1999.99, rating: 4.9, reviews: 4320,  category: "Electronics", badge: "Best Seller", image: "https://picsum.photos/seed/macbookm3/400/400" },
  { _id: "10", title: "Premium Arabica Coffee Beans 1kg",     price: 19.99,   originalPrice: 27.99,   discount: 29, rating: 4.7, reviews: 6712,  category: "Food",         image: "https://picsum.photos/seed/arabicacoffee/400/400" },
  { _id: "11", title: "Yoga Mat Non-Slip Extra Thick 6mm",    price: 34.99,   originalPrice: 49.99,   discount: 30, rating: 4.5, reviews: 2891,  category: "Sports",       image: "https://picsum.photos/seed/yogamat6mm/400/400" },
  { _id: "12", title: "iPad Air 5th Gen 64GB Wi-Fi",          price: 599.99,  originalPrice: 699.99,  discount: 14, rating: 4.6, reviews: 3204,  category: "Electronics",  image: "https://picsum.photos/seed/ipadair5/400/400" },
  { _id: "13", title: "Lego Technic Bugatti Chiron Set",      price: 349.99,  rating: 4.8, reviews: 1432,  category: "Toys",         badge: "Best Seller", image: "https://picsum.photos/seed/legobugatti/400/400" },
  { _id: "14", title: "Atomic Habits — James Clear",          price: 14.99,   originalPrice: 24.99,   discount: 40, rating: 4.9, reviews: 98432, category: "Books",        badge: "Best Seller", image: "https://picsum.photos/seed/atomichabits/400/400" },
  { _id: "15", title: "Dyson V15 Detect Cordless Vacuum",     price: 649.99,  originalPrice: 749.99,  discount: 13, rating: 4.7, reviews: 7823,  category: "Home & Garden", image: "https://picsum.photos/seed/dysonv15/400/400" },
  { _id: "16", title: "Instant Pot Duo 7-in-1 Pressure Cooker", price: 89.99, originalPrice: 119.99, discount: 25, rating: 4.6, reviews: 45231, category: "Home & Garden", badge: "Best Seller", image: "https://picsum.photos/seed/instantpot/400/400" },
];

export default function Home() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const search   = searchParams.get("search")   || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ search, category });
        const list = res.data?.data || res.data;
        if (Array.isArray(list) && list.length) setProducts(list);
      } catch {
        // use mock data on error
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, [search, category]);

  const filtered = products.filter((p) => {
    const name = p.title || p.name || '';
    const cat  = p.category || '';
    const matchSearch = !search   || name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !category || cat === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* ── Hero Banner ── */}
      {!search && !category && (
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-700 text-white py-14 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="text-xs font-bold text-yellow-300 mb-2 uppercase tracking-widest">🔥 Limited Time Deals</p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Shop Smarter,<br />
                <span className="text-yellow-300">Save Bigger</span>
              </h1>
              <p className="text-gray-300 text-base mb-6 max-w-md">
                Discover millions of products from trusted sellers. Best prices, fast delivery, guaranteed.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/?category=Electronics" className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition flex items-center gap-2 text-sm">
                  Shop Now <FiArrowRight />
                </Link>
                <Link to="/register" className="border-2 border-white/60 text-white px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition font-medium text-sm">
                  Start Selling
                </Link>
              </div>
            </div>
            {/* Mini product previews */}
            <div className="flex-1 grid grid-cols-4 gap-2 max-w-md">
              {MOCK_PRODUCTS.slice(0, 8).map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className="bg-white/10 backdrop-blur rounded-xl overflow-hidden hover:bg-white/20 transition">
                  <img src={p.image} alt={p.title} className="w-full h-16 object-cover" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust Badges ── */}
      {!search && !category && (
        <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: FiTruck,     label: "Free Shipping",  sub: "Orders over $50" },
              { icon: FiShield,    label: "Secure Payment", sub: "100% protected" },
              { icon: FiTrendingUp,label: "Best Deals",     sub: "Updated daily" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center justify-center gap-2">
                <Icon size={18} className="text-yellow-500 flex-shrink-0" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 sm:hidden">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Categories ── */}
        {!search && !category && (
          <section className="mb-10">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/?category=${cat.name}`}
                  className={`${cat.color} border rounded-xl p-3 text-center hover:scale-105 hover:shadow-md transition-all duration-200`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <p className="text-[11px] font-bold leading-tight">{cat.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Products Section ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {category
                  ? `${category}`
                  : search
                  ? `Results for "${search}"`
                  : "Featured Products"}
              </h2>
              {!loading && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
            {(search || category) && (
              <Link to="/" className="text-sm text-yellow-600 hover:underline font-medium">
                ✕ Clear filter
              </Link>
            )}
          </div>

          {/* Skeleton grid */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">No products found</p>
              <p className="text-sm mt-1">Try a different search or category</p>
              <Link to="/" className="mt-4 inline-block bg-yellow-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-yellow-600 transition">
                Browse All Products
              </Link>
            </div>
          )}

          {/* Product grid — Amazon style: 2 → 3 → 4 → 5 columns */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
