import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string | null;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}

const MainHeader = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        headerRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          logoRef.current,
          { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
          { clipPath: 'circle(100% at 50% 50%)', opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          navRef.current?.children || [],
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)' },
          '-=0.3'
        );
    });

    return () => ctx.revert();
  }, []);

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    {
      label: 'Corporate',
      href: '/about-us',
      hasDropdown: true,
      dropdownItems: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Our Team', href: '/about-us#team' },
        { label: 'Partners', href: '/about-us#partners' },
        { label: 'Careers', href: '/partnership' },
      ]
    },
    {
      label: 'Services',
      href: null, // dropdown only, no page navigation
      hasDropdown: true,
      dropdownItems: [
        { label: 'Campus Design & Execution', href: '/campus-design-execution' },
        { label: 'Furniture Design & Supply', href: '/furniture-design-supply' },
        { label: 'Sports Design & Execution', href: '/sports-design-execution' },
        { label: 'AI/Digital Solutions', href: '/ai-digital-design-supply' },
      ]
    },
    {
      label: 'Solutions',
      href: null, // dropdown only, no page navigation
      hasDropdown: true,
      dropdownItems: [
        { label: 'Laboratories', href: '/labs' },
        { label: 'Libraries', href: '/libraries' },
        { label: 'Innovation Centres', href: '/innovation-centres' },
        { label: 'Learning Environments', href: '/new-environments' },
        { label: 'AI Stations', href: '/ai-stations' },
      ]
    },
    { label: 'Catalogues', href: '/catalogues' },
    { label: 'Shop', href: '/shop' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact-us' },
  ];

  const isActive = (path?: string | null) => {
    if (!path) return false;
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      ref={headerRef}
      className={`main-header relative z-[70] ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`header-inner flex items-center justify-between ${isScrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <div ref={logoRef} className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-12 md:h-[60px] flex items-center">
                 <img src="/logo.png" alt="CampusMart" className="h-full w-auto object-contain" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul ref={navRef} className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <li key={item.label} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(item.label)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {item.href ? (
                        // Regular link with dropdown
                        <Link
                          to={item.href}
                          className={`nav-link flex items-center gap-1 ${isActive(item.href) ? 'bg-cm-blue text-white rounded-full' : ''}`}
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
                        </Link>
                      ) : (
                        // Dropdown-only button (no navigation)
                        <button
                          className="nav-link flex items-center gap-1 cursor-pointer"
                          onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                      {dropdownOpen === item.label && item.dropdownItems && (
                        <div className="absolute top-full left-0 pt-2 z-[100] animate-fade-in">
                          <div className="w-52 rounded-xl border border-slate-100 bg-white py-2 shadow-xl">
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.label}
                                to={dropdownItem.href}
                                className="block px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-slate-700 hover:bg-cm-blue hover:text-white transition-colors font-semibold"
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : item.href ? (
                    <Link
                      to={item.href}
                      className={`nav-link ${isActive(item.href) ? 'bg-cm-blue text-white rounded-full' : ''}`}
                    >
                      {item.label}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-black/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-black/10">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm font-semibold uppercase hover:bg-cm-blue hover:text-white rounded-lg transition-colors flex items-center justify-between ${item.href && isActive(item.href) ? 'bg-cm-blue text-white' : ''}`}
                        onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {dropdownOpen === item.label && item.dropdownItems && (
                        <div className="pl-4 mt-1 space-y-1">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              to={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-cm-blue transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : item.href ? (
                    <Link
                      to={item.href}
                      className={`block px-4 py-2 text-sm font-semibold uppercase hover:bg-cm-blue hover:text-white rounded-lg transition-colors ${isActive(item.href) ? 'bg-cm-blue text-white' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
