import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Tag } from 'lucide-react';
import api from '../api/client';

interface Category {
    id: number;
    name: string;
    slug: string;
    _count?: { products: number };
}

const EMPTY: Partial<Category> = { name: '', slug: '' };

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Partial<Category>>(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/products/categories');
            setCategories(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openAdd = () => {
        setEditing(EMPTY);
        setShowModal(true);
    };

    const openEdit = (c: Category) => {
        setEditing(c);
        setShowModal(true);
    };

    const save = async () => {
        if (!editing.name) return;
        setSaving(true);
        try {
            if (editing.id) {
                await api.put(`/products/categories/${editing.id}`, editing);
            } else {
                await api.post('/products/categories', editing);
            }
            await fetchCategories();
            setShowModal(false);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const deleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/products/categories/${id}`);
            await fetchCategories();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete category. Ensure no products are linked.');
        }
    };

    const filtered = categories.filter(c => 
        (c.name || '').toLowerCase().includes((search || '').toLowerCase()) || 
        (c.slug || '').toLowerCase().includes((search || '').toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Categories</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{categories.length} Categories defined</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                    <Plus className="w-5 h-5" /> New Category
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Search categories..." 
                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Loading Categories...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400">No categories found.</div>
                ) : filtered.map((cat) => (
                    <div key={cat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Tag className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{cat.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{cat.slug}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all border border-blue-100 hover:border-blue-600"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-100 hover:border-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between p-8 border-b">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">{editing.id ? 'Edit Category' : 'Add New Category'}</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Classification Management</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                                <input 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium" 
                                    value={editing.name || ''} 
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })} 
                                    placeholder="e.g. Science Lab Equipment"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Slug</label>
                                <input 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-xs" 
                                    value={editing.slug || ''} 
                                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })} 
                                    placeholder="science-lab (automatic if left blank)"
                                />
                            </div>
                        </div>
                        <div className="p-8 border-t flex justify-end gap-3 bg-slate-50/50 rounded-b-3xl">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                            <button onClick={save} disabled={saving} className="px-8 py-2.5 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                                {saving ? 'Saving...' : 'Confirm Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
