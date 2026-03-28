import { Head, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function ProductDetail({ auth, product }) {
    const { post, processing } = useForm({
        product_id: product.id,
        quantity: 1,
    });

    const addToCart = (e) => {
        e.preventDefault();
        post('/cart/add');
    };

    return (
        <Layout>
            <Head title={product.name} />

            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                        {/* Image */}
                        <div className="flex flex-col-reverse">
                            <div className="w-full aspect-w-1 aspect-h-1">
                                {product.image ? (
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-96 object-center object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">No image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                {product.name}
                            </h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl text-gray-900">
                                    ৳{(product.discount_price || product.price).toFixed(2)}
                                    {product.discount_price && (
                                        <span className="ml-3 text-xl text-gray-500 line-through">
                                            ৳{parseFloat(product.price).toFixed(2)}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>
                                <div className="text-base text-gray-700 space-y-6">
                                    {product.description}
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">Type:</span>
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                                        {product.type}
                                    </span>
                                </div>
                                {product.author && (
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm text-gray-500 mr-2">Author:</span>
                                        <span className="text-sm font-medium text-gray-900">{product.author}</span>
                                    </div>
                                )}
                                {product.duration && (
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm text-gray-500 mr-2">Duration:</span>
                                        <span className="text-sm font-medium text-gray-900">{product.duration}</span>
                                    </div>
                                )}
                                <div className="flex items-center mt-2">
                                    <span className="text-sm text-gray-500 mr-2">Stock:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={addToCart} className="mt-10">
                                <button
                                    type="submit"
                                    disabled={processing || product.stock === 0}
                                    className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </form>

                            {product.content && (
                                <div className="mt-10">
                                    <h3 className="text-lg font-medium text-gray-900">Content</h3>
                                    <div className="mt-4 prose prose-sm text-gray-500">
                                        {product.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
