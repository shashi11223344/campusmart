import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, ShoppingBag, Heart, MapPin, CreditCard, LogOut, Edit, Package, Trash2, Plus, X } from 'lucide-react';
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

interface Address {
  id: number;
  type: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  label: string;
  detail: string;
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  orderitem: { id: number; qty: number; product: { name: string } }[];
}

type AddressForm = Omit<Address, 'id'>;

const emptyAddress: AddressForm = {
  type: 'Home',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

const MyAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storedUser = localStorage.getItem('cm_user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem('cm_token') && !!currentUser;
  const paymentStorageKey = `cm_payment_methods_${currentUser?.id || currentUser?.email || 'user'}`;
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileForm, setProfileForm] = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '', institution: currentUser?.institution || '' });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ type: 'card' as PaymentMethod['type'], holder: '', cardNumber: '', expiry: '', upiId: '', bankName: '' });
  const [paymentError, setPaymentError] = useState('');
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
    if (!isLoggedIn) return;
    setOrdersLoading(true);
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
    const storedMethods = localStorage.getItem(paymentStorageKey);
    if (storedMethods) {
      try { setPaymentMethods(JSON.parse(storedMethods)); } catch { setPaymentMethods([]); }
    }
  }, [isLoggedIn, paymentStorageKey]);

  useEffect(() => {
    if (!isLoggedIn || activeTab !== 'addresses') return;
    setAddressesLoading(true);
    api.get('/addresses')
      .then(({ data }) => setAddresses(data))
      .catch((err: any) => setAddressError(err.response?.data?.error || 'Failed to load addresses.'))
      .finally(() => setAddressesLoading(false));
  }, [activeTab, isLoggedIn]);

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

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      localStorage.setItem('cm_user', JSON.stringify(data));
      setProfileEditing(false);
      window.location.reload();
    } catch (err: any) {
      setProfileError(err.response?.data?.error || 'Profile update failed.');
    } finally {
      setProfileSaving(false);
    }
  };

  const savePaymentMethods = (methods: PaymentMethod[]) => {
    setPaymentMethods(methods);
    localStorage.setItem(paymentStorageKey, JSON.stringify(methods));
  };

  const addPaymentMethod = (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentError('');
    let detail = '';
    let label = '';
    if (paymentForm.type === 'card') {
      const digits = paymentForm.cardNumber.replace(/\D/g, '');
      if (digits.length < 12 || digits.length > 19 || !paymentForm.holder || !/^\d{2}\/\d{2}$/.test(paymentForm.expiry)) {
        setPaymentError('Enter a valid cardholder name, card number, and expiry in MM/YY format.');
        return;
      }
      label = 'Card';
      detail = `•••• ${digits.slice(-4)} · ${paymentForm.expiry}`;
    } else if (paymentForm.type === 'upi') {
      if (!/^[\w.-]+@[\w.-]+$/.test(paymentForm.upiId)) {
        setPaymentError('Enter a valid UPI ID, for example name@bank.');
        return;
      }
      label = 'UPI';
      detail = paymentForm.upiId;
    } else {
      if (!paymentForm.bankName.trim()) {
        setPaymentError('Enter a bank name.');
        return;
      }
      label = 'Net Banking';
      detail = paymentForm.bankName.trim();
    }
    savePaymentMethods([...paymentMethods, { id: crypto.randomUUID(), type: paymentForm.type, label, detail }]);
    setPaymentForm({ type: 'card', holder: '', cardNumber: '', expiry: '', upiId: '', bankName: '' });
    setPaymentFormOpen(false);
  };

  const removePaymentMethod = (id: string) => {
    savePaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  ];

  const openNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
    setAddressError('');
    setAddressFormOpen(true);
  };

  const openEditAddressForm = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      type: address.type,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setAddressError('');
    setAddressFormOpen(true);
  };

  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    setAddressSaving(true);
    setAddressError('');
    try {
      const request = editingAddressId
        ? api.put(`/addresses/${editingAddressId}`, { ...addressForm, isDefault: false })
        : api.post('/addresses', { ...addressForm, isDefault: false });
      const { data } = await request;
      setAddresses((current) => editingAddressId
        ? current.map((address) => address.id === editingAddressId ? data : address)
        : [...current, data]);
      setAddressFormOpen(false);
    } catch (err: any) {
      setAddressError(err.response?.data?.error || 'Failed to save address.');
    } finally {
      setAddressSaving(false);
    }
  };

  const deleteAddress = async (id: number) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses((current) => current.filter((address) => address.id !== id));
    } catch (err: any) {
      setAddressError(err.response?.data?.error || 'Failed to delete address.');
    }
  };

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
                  <button onClick={() => { setProfileEditing(true); setProfileForm({ name: currentUser?.name || '', phone: currentUser?.phone || '', institution: currentUser?.institution || '' }); }} className="flex items-center gap-2 text-cm-blue hover:underline">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                {profileError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{profileError}</div>}
                {profileEditing ? (
                  <form onSubmit={saveProfile} className="space-y-4">
                    <input required value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="form-input" placeholder="Full name" />
                    <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="form-input" placeholder="Phone" pattern="(?:\+91[ -]?)?[6-9][0-9]{9}" minLength={10} maxLength={14} />
                    <input value={profileForm.institution} onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })} className="form-input" placeholder="Institution" />
                    <div className="flex gap-3"><button type="submit" disabled={profileSaving} className="btn-primary disabled:opacity-60">{profileSaving ? 'Saving...' : 'Save Changes'}</button><button type="button" onClick={() => setProfileEditing(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button></div>
                  </form>
                ) : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl p-8 shadow-card">
                <h2 className="text-xl font-bold text-cm-blue-dark mb-6">My Orders</h2>
                {ordersLoading ? <p className="text-sm text-gray-500">Loading orders...</p> : orders.length === 0 ? <div className="py-12 text-center"><Package className="mx-auto mb-4 h-12 w-12 text-gray-300" /><p className="text-gray-600">No orders yet.</p><p className="mt-2 text-sm text-gray-500">Completed orders will appear here after checkout.</p></div> : <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-cm-blue-dark">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-cm-blue">₹{order.total.toLocaleString('en-IN')}</p>
                          <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        {order.orderitem.reduce((total, item) => total + item.qty, 0)} items
                      </div>
                    </div>
                  ))}
                </div>}
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
                  <button onClick={openNewAddressForm} className="btn-primary text-sm">Add New Address</button>
                </div>
                {addressError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{addressError}</div>}
                {addressFormOpen && (
                  <form onSubmit={saveAddress} className="mb-6 border rounded-lg p-4 space-y-4 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input required value={addressForm.type} onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })} className="form-input" placeholder="Label (Home, Office...)" />
                      <input required inputMode="numeric" pattern="[1-9][0-9]{5}" minLength={6} maxLength={6} value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} className="form-input" placeholder="6-digit pincode" />
                    </div>
                    <input required value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} className="form-input" placeholder="Address line 1" />
                    <input value={addressForm.line2 || ''} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })} className="form-input" placeholder="Address line 2 (optional)" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input required value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="form-input" placeholder="City" />
                      <input required value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="form-input" placeholder="State" />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={addressSaving} className="btn-primary disabled:opacity-60">{addressSaving ? 'Saving...' : editingAddressId ? 'Save Changes' : 'Add Address'}</button>
                      <button type="button" onClick={() => setAddressFormOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                    </div>
                  </form>
                )}
                {addressesLoading ? <p className="text-sm text-gray-500">Loading addresses...</p> : addresses.length === 0 ? (
                  <p className="text-sm text-gray-500">No saved addresses. Add an address to get started.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-cm-blue-dark">{address.type}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{[address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(', ')}</p>
                        <div className="mt-4 flex gap-3">
                          <button onClick={() => openEditAddressForm(address)} className="text-sm text-cm-blue hover:underline">Edit</button>
                          <button onClick={() => deleteAddress(address.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl p-8 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-cm-blue-dark">Payment Methods</h2>
                  <button onClick={() => { setPaymentError(''); setPaymentFormOpen(true); }} className="btn-primary text-sm inline-flex items-center gap-2"><Plus className="h-4 w-4" />Add Payment Method</button>
                </div>
                {paymentFormOpen && <form onSubmit={addPaymentMethod} className="mb-6 rounded-lg border bg-gray-50 p-4 space-y-4">
                  <div className="flex items-center justify-between"><h3 className="font-semibold text-cm-blue-dark">Add payment method</h3><button type="button" onClick={() => setPaymentFormOpen(false)} aria-label="Close payment form"><X className="h-4 w-4" /></button></div>
                  <select value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value as PaymentMethod['type'] })} className="form-input"><option value="card">Credit / Debit Card</option><option value="upi">UPI</option><option value="netbanking">Net Banking</option></select>
                  {paymentForm.type === 'card' && <><input required value={paymentForm.holder} onChange={(e) => setPaymentForm({ ...paymentForm, holder: e.target.value })} className="form-input" placeholder="Cardholder name" /><input required inputMode="numeric" value={paymentForm.cardNumber} onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 19) })} className="form-input" placeholder="Card number" /><input required value={paymentForm.expiry} onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value.replace(/[^\d/]/g, '').slice(0, 5) })} className="form-input" placeholder="Expiry MM/YY" /></>}
                  {paymentForm.type === 'upi' && <input required value={paymentForm.upiId} onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })} className="form-input" placeholder="name@bank" />}
                  {paymentForm.type === 'netbanking' && <input required value={paymentForm.bankName} onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })} className="form-input" placeholder="Bank name" />}
                  {paymentError && <p className="text-sm text-red-600">{paymentError}</p>}<button type="submit" className="btn-primary">Save Payment Method</button>
                </form>}
                {paymentMethods.length === 0 && !paymentFormOpen ? <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">No saved payment methods</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add a card, UPI ID, or net banking account for faster checkout
                  </p>
                </div> : <div className="space-y-3">{paymentMethods.map((method) => <div key={method.id} className="flex items-center justify-between rounded-lg border p-4"><div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-cm-blue" /><div><p className="font-semibold text-cm-blue-dark">{method.label}</p><p className="text-sm text-gray-500">{method.detail}</p></div></div><button onClick={() => removePaymentMethod(method.id)} aria-label={`Remove ${method.label}`} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>)}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyAccount;
