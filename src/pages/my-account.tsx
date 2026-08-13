import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, ShoppingBag, Heart, MapPin, CreditCard, LogOut, Edit, Package } from 'lucide-react';
import api from '@/api/client';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    slug: string;
    category?: { name: string; slug: string };
  };
}

const MyAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const storedUser = localStorage.getItem('cm_user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem('cm_token') && !!currentUser;

  const handleLogout = () => {
    localStorage.removeItem('cm_token');
    localStorage.removeItem('cm_user');
    navigate('/login');
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    setWishlistLoading(true);
    api.get('/wishlist')
      .then(({ data }) => setWishlist(data))
      .catch(() => setWishlist([]))
      .finally(() => setWishlistLoading(false));
  }, [isLoggedIn]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const removeFromWishlist = async (productId: number) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to remove from wishlist');
    }
  };

  const moveToCart = async (productId: number) => {
    try {
      await api.post('/wishlist', { productId });
      alert('Product added to cart (wishlist).');
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('Please login to add products to cart.');
      } else {
        alert(err.response?.data?.error || 'Failed to add to cart.');
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  ];

  const orders = [
    { id: 'ORD001', date: '2024-01-15', total: 45000, status: 'Delivered', items: 3 },
    { id: 'ORD002', date: '2024-01-10', total: 125000, status: 'Processing', items: 1 },
    { id: 'ORD003', date: '2023-12-28', total: 28000, status: 'Delivered', items: 2 },
  ];

  const addresses = [
    { id: 1, type: 'Home', address: '123, Main Street, Bangalore, Karnataka - 560001', default: true },
    { id: 2, type: 'Office', address: '456, Business Park, Bangalore, Karnataka - 560002', default: false },
  ];

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-cm-gray flex items-center justify-center py-4">
        <div className="bg-white rounded-2xl p-8 shadow-card max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cm-blue/10 flex items-center justify-center">
            <User className="w-10 h-10 text-cm-blue" />
          </div>
          <h1 className="text-2xl font-bold text-cm-blue-dark mb-4">
            Welcome to Campus Mart
          </h1>
          <p className="text-gray-600 mb-8">
            Please login or create an account to access your profile, orders, and wishlist.
          </p>
          <div className="space-y-3">
            <Link to="/login" className="btn-primary w-full block">
              Login
            </Link>
            <Link to="/registration" className="btn-secondary w-full block">
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cm-gray py-8">
      <div className="w-full mx-auto px-2 sm:px-4">
        <h1 className="text-3xl font-bold text-cm-blue-dark mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-2">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-6 bg-cm-blue text-white">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-center">{currentUser?.name || 'User'}</h2>
                <p className="text-white/80 text-center text-sm">{currentUser?.email || ''}</p>
              </div>
              <nav className="p-4">
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                          ? 'bg-cm-blue text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                          }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl p-8 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-cm-blue-dark">Profile Information</h2>
                  <button className="flex items-center gap-2 text-cm-blue hover:underline">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="font-semibold text-cm-blue-dark">{currentUser?.name || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-semibold text-cm-blue-dark">{currentUser?.email || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-semibold text-cm-blue-dark">{currentUser?.phone || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Institution</label>
                    <p className="font-semibold text-cm-blue-dark">{currentUser?.institution || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl p-8 shadow-card">
                <h2 className="text-xl font-bold text-cm-blue-dark mb-6">My Orders</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-cm-blue-dark">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-cm-blue">₹{order.total.toLocaleString()}</p>
                          <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        {order.items} items
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl p-8 shadow-card">
                <h2 className="text-xl font-bold text-cm-blue-dark mb-6">My Wishlist</h2>
                {wishlistLoading ? (
                  <div className="text-sm text-slate-500">Loading wishlist...</div>
                ) : wishlist.length === 0 ? (
                  <div className="text-sm text-slate-500">Your wishlist is empty. Add items from the product page or shop.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                        <img
                          src={item.product.imageUrl || 'https://via.placeholder.com/160'}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-cm-blue-dark">{item.product.name}</h3>
                          <p className="text-cm-blue font-bold">₹{item.product.price.toLocaleString()}</p>
                          <div className="flex gap-3 mt-3">
                            <button onClick={() => moveToCart(item.product.id)} className="text-sm text-cm-blue hover:underline">
                              Move to Cart
                            </button>
                            <button onClick={() => removeFromWishlist(item.product.id)} className="text-sm text-red-600 hover:underline">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-xl p-8 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-cm-blue-dark">Saved Addresses</h2>
                  <button className="btn-primary text-sm">Add New Address</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-cm-blue-dark">{address.type}</span>
                        {address.default && (
                          <span className="text-xs bg-cm-blue text-white px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{address.address}</p>
                      <div className="mt-4 flex gap-3">
                        <button className="text-sm text-cm-blue hover:underline">Edit</button>
                        <button className="text-sm text-red-600 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl p-8 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-cm-blue-dark">Payment Methods</h2>
                  <button className="btn-primary text-sm">Add New Card</button>
                </div>
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">No saved payment methods</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add a card for faster checkout
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyAccount;
