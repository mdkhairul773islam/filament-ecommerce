import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';

export default function Layout({ children }) {
    const { auth, flash, cartItemsCount, settings } = usePage().props;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const userMenuRef = useRef(null);

    useEffect(() => {
        if (flash.success) {
            addNotification(flash.success, 'success');
        }
        if (flash.error) {
            addNotification(flash.error, 'error');
        }
    }, [flash]);

    const addNotification = (message, type) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 4000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Set dynamic favicon
    useEffect(() => {
        if (settings?.site_favicon) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = settings.site_favicon;
        }
    }, [settings?.site_favicon]);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 sm:h-20">
                        <div className="flex">
                            <Link href="/" className="flex items-center sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:left-6 lg:left-8 sm:z-10">
                                {settings?.site_logo ? (
                                    <img 
                                        src={settings.site_logo} 
                                        alt={settings.site_name || 'Logo'} 
                                        className="h-10 w-auto sm:h-20 sm:object-contain drop-shadow-sm"
                                    />
                                ) : (
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-indigo-600 sm:text-2xl">
                                            {settings?.site_name || 'MononKendra'}
                                        </span>
                                        {settings?.site_name_bangla && (
                                            <span className="text-xs text-gray-600 sm:text-sm">
                                                {settings.site_name_bangla}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                            <div className="hidden sm:flex sm:space-x-8 sm:ml-32 lg:ml-40">
                                <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                                    Home
                                </Link>
                                <Link href="/products" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                    Products
                                </Link>
                                <Link href="/products?type=book" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                    Books
                                </Link>
                                <Link href="/products?type=course" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                    Courses
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/cart" className="relative text-gray-500 hover:text-gray-900">
                                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>
                            {auth?.user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 focus:outline-none"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-sm font-medium">{auth.user.name}</span>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                <Link
                                                    href="/dashboard"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    My Orders
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Profile Settings
                                                </Link>
                                                <div className="border-t border-gray-100"></div>
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Logout
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link href="/login" className="text-gray-500 hover:text-gray-900">
                                        Login
                                    </Link>
                                    <Link 
                                        href="/register" 
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            {/* Footer - Rokomari Style */}
            <footer className="bg-gray-900 text-gray-300 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Column 1: About */}
                        <div>
                            <Link href="/" className="inline-block mb-4">
                                {settings?.site_logo ? (
                                    <img 
                                        src={settings.site_logo} 
                                        alt={settings.site_name || 'Logo'} 
                                        className="h-12 w-auto"
                                    />
                                ) : (
                                    <div>
                                        <h3 className="text-white text-xl font-bold">
                                            {settings?.site_name || 'MononKendra'}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {settings?.site_name_bangla || 'জ্ঞান ও প্রজ্ঞার আলো'}
                                        </p>
                                    </div>
                                )}
                            </Link>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p>{settings?.address || '2/1/E, Eden Center, Arambag, Motijheel, Dhaka-1000'}</p>
                                </div>
                                
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-white">Hotline: {settings?.hotline || '16297'}</p>
                                        <p className="text-xs text-gray-400">({settings?.hotline_time || '9 AM to 8 PM'})</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href={`mailto:${settings?.contact_email}`} className="hover:text-white">
                                        {settings?.contact_email || 'care@mononkendra.com'}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Customer Care */}
                        <div>
                            <h4 className="text-white font-bold mb-4">About Us</h4>
                            <ul className="space-y-2 text-sm">
                                {settings?.about_us && <li><Link href="/p/about_us" className="hover:text-white transition">About Us</Link></li>}
                                <li><a href={`mailto:${settings?.contact_email || 'contact@mononkendra.com'}`} className="hover:text-white transition">Contact Us</a></li>
                                {settings?.terms_conditions && <li><Link href="/p/terms_conditions" className="hover:text-white transition">Terms & Conditions</Link></li>}
                                {settings?.privacy_policy && <li><Link href="/p/privacy_policy" className="hover:text-white transition">Privacy Policy</Link></li>}
                                {settings?.refund_policy && <li><Link href="/p/refund_policy" className="hover:text-white transition">Refund Policy</Link></li>}
                            </ul>
                        </div>

                        {/* Column 3: Categories */}
                        <div>
                            <h4 className="text-white font-bold mb-4">Products</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/products?type=book" className="hover:text-white transition">Books</Link></li>
                                <li><Link href="/products?type=course" className="hover:text-white transition">Courses</Link></li>
                                <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
                            </ul>
                            
                            <h4 className="text-white font-bold mt-6 mb-4">Policies</h4>
                            <ul className="space-y-2 text-sm">
                                {settings?.shipping_policy && <li><Link href="/p/shipping_policy" className="hover:text-white transition">Shipping Policy</Link></li>}
                                {settings?.payment_policy && <li><Link href="/p/payment_policy" className="hover:text-white transition">Payment Policy</Link></li>}
                                {settings?.warranty_policy && <li><Link href="/p/warranty_policy" className="hover:text-white transition">Warranty Policy</Link></li>}
                            </ul>
                        </div>

                        {/* Column 4: Download & Social */}
                        <div>
                            <h4 className="text-white font-bold mb-4">JOIN US</h4>
                            <div className="flex flex-wrap gap-3 mb-6">
                                {settings?.facebook_url && (
                                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                )}
                                {settings?.instagram_url && (
                                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                )}
                                {settings?.youtube_url && (
                                    <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                )}
                                {settings?.linkedin_url && (
                                    <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                )}
                                {settings?.twitter_url && (
                                    <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </a>
                                )}
                                {settings?.telegram_url && (
                                    <a href={settings.telegram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                        </svg>
                                    </a>
                                )}
                                {settings?.whatsapp_number && (
                                    <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-700 pt-8 mt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                            <p>© {new Date().getFullYear()} {settings?.site_name || 'MononKendra'}. All rights reserved.</p>
                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                <span>Customer Care:</span>
                                <a href={`tel:${settings?.corporate_phone}`} className="hover:text-white font-medium">
                                    {settings?.corporate_phone || '01708166238'} (Corporate)
                                </a>
                                <a href={`tel:${settings?.retailer_phone}`} className="hover:text-white font-medium">
                                    {settings?.retailer_phone || '01708166185'} (Retailer)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-center gap-4 min-w-[340px] max-w-md p-4 rounded-xl shadow-2xl border-2 transform transition-all duration-500 ease-out bg-white ${
                            notification.type === 'success'
                                ? 'border-green-200'
                                : 'border-red-200'
                        }`}
                        style={{
                            animation: 'slideIn 0.3s ease-out'
                        }}
                    >
                        {/* Icon */}
                        <div className="shrink-0">
                            {notification.type === 'success' ? (
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        <div className="flex-1">
                            <p className={`font-bold text-sm leading-relaxed ${
                                notification.type === 'success'
                                    ? 'text-gray-800'
                                    : 'text-gray-800'
                            }`}>
                                {notification.message}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Add keyframes for animation */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
