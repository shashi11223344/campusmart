import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Filter, ChevronDown } from 'lucide-react';
import api from '@/api/client';

interface Category { id: number; name: string; slug: string; }
interface Product { id: number; name: string; slug: string; price: number; imageUrl?: string; rating: number; reviewCount: number; category: Category; }

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data));
  }, []);

  const addToCart = async (product: Product) => {
    try {
      await api.post('/wishlist', { productId: product.id });
      alert('Product added to wishlist for cart sync.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Please login to add products to wishlist.');
    }
  };

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { limit: '50' };
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    api.get('/products', { params })
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <main className="min-h-screen bg-cm-gray">
      <div className="bg-white border-b">
        <div className="w-full mx-auto px-2 sm:px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-cm-blue"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <Link to="/my-account" className="relative p-2 hover:bg-gray-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-2 sm:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-cm-blue" />
                <h3 className="font-bold text-cm-blue-dark">Categories</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === 'all' ? 'bg-cm-blue text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.slug ? 'bg-cm-blue text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-cm-blue-dark">
                {selectedCategory === 'all' ? 'All Products' : categories.find((c) => c.slug === selectedCategory)?.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort by:</span>
                <button className="flex items-center gap-1 px-3 py-1 bg-white rounded-lg border hover:bg-gray-50">
                  Popularity <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-4 border-cm-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-300 hover:-translate-y-1 flex flex-col group/card">
                    <Link to={`/product/${product.slug}`} className="cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden bg-white flex items-center justify-center p-2 group-hover/card:bg-slate-50/50 transition-colors">
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/400x300'}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover/card:scale-105 transition-all duration-500"
                        />
                      </div>
                    </Link>
                    <div className="p-3.5 flex-grow flex flex-col justify-between border-t border-slate-50">
                      <div>
                        <Link to={`/product/${product.slug}`} className="cursor-pointer group">
                          <h3 className="font-semibold text-cm-blue-dark text-xs sm:text-sm tracking-tight mb-1 cursor-pointer group-hover:text-cm-blue transition-colors leading-snug line-clamp-2 min-h-[32px] sm:min-h-[36px]" title={product.name}>
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/60">
                        <span className="text-sm sm:text-base font-bold text-cm-blue tracking-tight">{formatPrice(product.price)}</span>
                        <button onClick={() => addToCart(product)} className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-cm-blue text-white rounded-lg hover:bg-cm-blue-dark transition-all duration-200 font-bold text-xs shadow-sm hover:shadow focus:ring-2 focus:ring-cm-blue/20">
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline-block">Add</span>
                          <span className="inline-block xl:hidden">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Shop;
