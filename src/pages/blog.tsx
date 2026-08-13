import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Search, ChevronRight, Tags } from 'lucide-react';
import api from '@/api/client';
import { usePageData } from '@/hooks/usePageData';

interface Category { id: number; name: string; slug: string; }
interface Post { id: number; title: string; excerpt: string; publishedAt?: string; imageUrl?: string; slug: string; category?: Category }

const DEFAULTS = {
  heroTitle: 'The Resource Hub',
  heroSubtitle: 'Insights, trends, and best practices in educational infrastructure.'
};

const Blog = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { data } = usePageData('blog');

  const heroTitle = data.heroTitle ?? DEFAULTS.heroTitle;
  const heroSubtitle = data.heroSubtitle ?? DEFAULTS.heroSubtitle;

  // Interactive states
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('limit', '50');
    if (activeCategory) params.set('category', activeCategory);

    Promise.all([
      api.get('/blog?' + params.toString()),
      api.get('/blog/categories')
    ]).then(([postsRes, catRes]) => {
      setPosts(postsRes.data.posts);
      setCategories(catRes.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const filteredPosts = posts.filter(p => !searchQuery || (p.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || (p.excerpt || '').toLowerCase().includes((searchQuery || '').toLowerCase()));

  return (
    <main className="min-h-screen bg-gray-50/50">
      <section ref={heroRef} className="bg-cm-blue mx-3 sm:mx-6 lg:mx-8 rounded-[2rem] py-20 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{heroTitle}</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Sidebar */}
            <div className="w-full lg:w-1/4 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-8">
                {/* Search */}
                <div>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search articles..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cm-blue bg-white shadow-sm transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-cm-blue transition-colors" />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Topics</h3>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveCategory(null)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between group ${activeCategory === null ? 'bg-cm-blue text-white shadow-md' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                      >
                        <span className="font-medium">All Posts</span>
                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeCategory === null ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    </li>
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <button
                          onClick={() => setActiveCategory(cat.slug)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between group ${activeCategory === cat.slug ? 'bg-cm-blue text-white shadow-md' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                        >
                          <span className="font-medium">{cat.name}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeCategory === cat.slug ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                      </li>
                    ))}
                    {categories.length === 0 && <li className="px-4 py-2 text-sm text-gray-400">Loading categories...</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Content Stream */}
            <div className="w-full lg:w-3/4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-cm-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="group flex flex-col md:flex-row gap-6 bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-card transition-all duration-300">
                        {/* Image Thumbnail */}
                        <div className="md:w-1/3 shrink-0 h-52 md:h-auto rounded-xl overflow-hidden relative">
                          <img
                            src={post.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80'}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                        </div>

                        {/* Content */}
                        <div className="md:w-2/3 flex flex-col justify-center py-2 pr-4">
                          <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 mb-3">
                            <span className="bg-blue-50 text-cm-blue px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wide flex items-center gap-1">
                              <Tags className="w-3 h-3" />
                              {post.category?.name || 'General'}
                            </span>
                            {post.publishedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-cm-blue-dark mb-3 group-hover:text-cm-blue transition-colors leading-tight">
                            <Link to={`/blog/${post.slug}`} className="focus:outline-none">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 mb-5 line-clamp-2 text-base leading-relaxed">{post.excerpt}</p>

                          <div className="mt-auto">
                            <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-gray-900 font-bold hover:text-cm-blue transition-colors group/btn">
                              Read Full Article
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!loading && filteredPosts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                      <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
