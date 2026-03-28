import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { useState } from 'react';

export default function Products({ auth, products, categories, filters }) {
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');

    return (
        <Layout>
            <Head title="Products" />

            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">All Products</h1>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex-1">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedCategory(value);
                                    window.location.href = `/products?category=${value}&type=${selectedType}`;
                                }}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">All Categories</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.slug}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                Type
                            </label>
                            <select
                                id="type"
                                value={selectedType}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedType(value);
                                    window.location.href = `/products?category=${selectedCategory}&type=${value}`;
                                }}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">All Types</option>
                                <option value="book">Books</option>
                                <option value="course">Courses</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products?.data?.map((product) => (
                            <div key={product.id} className="group">
                                <Link href={`/products/${product.slug}`}>
                                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
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
                                    </div>
                                    <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                    <div className="mt-1 flex items-center justify-between">
                                        <p className="text-sm text-gray-500 capitalize">{product.type}</p>
                                        {product.author && (
                                            <p className="text-xs text-gray-400">by {product.author}</p>
                                        )}
                                    </div>
                                    <p className="mt-1 text-lg font-medium text-gray-900">
                                        ৳{(product.discount_price || product.price).toFixed(2)}
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
                    {products?.links && (
                        <div className="mt-8 flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                {products.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            link.active
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        } ${!link.url ? 'cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
