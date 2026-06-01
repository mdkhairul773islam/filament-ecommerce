import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { useState, useEffect } from 'react';

export default function Products({ auth, products, categories, filters, fbEventId, fbEventType }) {
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        if (typeof fbq !== 'undefined' && fbEventId && fbEventType) {
            if (fbEventType === 'Search') {
                fbq('track', 'Search', {
                    search_string: filters?.search,
                    content_type: 'product',
                }, { eventID: fbEventId });
            } else if (fbEventType === 'ViewCategory') {
                fbq('trackCustom', 'ViewCategory', {
                    content_category: filters?.category,
                    content_type: 'product',
                }, { eventID: fbEventId });
            }
        }
    }, [fbEventId]);

    const applyFilters = (category, type, searchVal) => {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (type) params.set('type', type);
        if (searchVal) params.set('search', searchVal);
        window.location.href = `/products?${params.toString()}`;
    };
    return (
        <Layout>
            <Head title="Products" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedCategory(value);
                                        applyFilters(value, selectedType, search);
                                    }}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Type
                                </label>
                                <select
                                    id="type"
                                    value={selectedType}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedType(value);
                                        applyFilters(selectedCategory, value, search);
                                    }}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="book">Books</option>
                                    <option value="course">Courses</option>
                                </select>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mt-4">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    applyFilters(selectedCategory, selectedType, search);
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products?.data?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No products found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {products?.data?.map((product) => (
                                    <div key={product.id} className="group relative">
                                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                            <Link href={`/products/${product.slug}`}>
                                                {product.image ? (
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="w-full h-64 object-center object-cover group-hover:opacity-75"
                                                    />
                                                ) : (
                                                    <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                                                        <span className="text-gray-500">No image</span>
                                                    </div>
                                                )}
                                            </Link>
                                            {/* Discount Badge */}
                                            {product.discount_price && product.show_discount_badge && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                        {product.discount_type === 'flat' 
                                                            ? `৳${parseFloat(product.discount_price).toFixed(0)} OFF`
                                                            : `${Math.round(parseFloat(product.discount_price))}% OFF`
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {/* Add to Cart Icon */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // Add to cart functionality would go here
                                                    window.location.href = `/products/${product.slug}`;
                                                }}
                                                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-indigo-700"
                                                title="Add to Cart"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <Link href={`/products/${product.slug}`}>
                                            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500 capitalize">{product.type}</p>
                                            <p className="mt-1 text-lg font-medium text-gray-900">
                                                ৳{product.discount_price 
                                                    ? (product.discount_type === 'flat' 
                                                        ? (parseFloat(product.price) - parseFloat(product.discount_price)).toFixed(2)
                                                        : (parseFloat(product.price) * (1 - parseFloat(product.discount_price) / 100)).toFixed(2)
                                                      )
                                                    : parseFloat(product.price).toFixed(2)
                                                }
                                                {product.discount_price && (
                                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                                        ৳{parseFloat(product.price).toFixed(2)}
                                                    </span>
                                                )}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products?.links && products.links.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveScroll
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''} ${
                                                    index === 0 ? 'rounded-l-md' : ''
                                                } ${index === products.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
