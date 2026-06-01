import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '../Layouts/Layout';

export default function Cart({ auth, cart }) {
    const { flash } = usePage().props;
    const { delete: destroy } = useForm();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        if (typeof fbq !== 'undefined' && flash?.fb_event?.type === 'AddToCart') {
            const { event_id, data } = flash.fb_event;
            fbq('track', 'AddToCart', data, { eventID: event_id });
        }
    }, [flash?.fb_event]);

    const removeFromCart = (itemId) => {
        setItemToDelete(itemId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            destroy(`/cart/${itemToDelete}`);
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return;
        router.patch(`/cart/${itemId}`, 
            { quantity },
            { preserveScroll: true }
        );
    };

    const total = cart?.items?.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0) || 0;

    return (
        <Layout>
            <Head title="Shopping Cart" />

            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

                    {cart?.items?.length > 0 ? (
                        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                            <div className="lg:col-span-7">
                                <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                                    {cart.items.map((item) => (
                                        <li key={item.id} className="py-6 flex">
                                            <div className="shrink-0">
                                                {item.product?.image ? (
                                                    <img
                                                        src={`/storage/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-24 h-24 rounded-md object-center object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-md bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">No image</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="ml-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>
                                                            <Link href={`/products/${item.product?.slug}`}>
                                                                {item.product?.name}
                                                            </Link>
                                                        </h3>
                                                        <p className="ml-4">৳{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500 capitalize">
                                                        {item.product?.type}
                                                    </p>
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-gray-700">Qty:</span>
                                                        <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                            <input
                                                                type="number"
                                                                id={`quantity-${item.id}`}
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                                className="w-14 text-center border-0 focus:ring-0 font-semibold text-gray-900 bg-transparent"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-r-lg"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="flex items-center gap-1.5 font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-10 lg:mt-0 lg:col-span-5">
                                <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                            <dt className="text-base font-medium text-gray-900">Order total</dt>
                                            <dd className="text-base font-medium text-gray-900">৳{total.toFixed(2)}</dd>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            href="/checkout"
                                            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 flex items-center justify-center"
                                        >
                                            Proceed to Checkout
                                        </Link>
                                    </div>

                                    <div className="mt-6 text-sm text-center text-gray-500">
                                        <p>
                                            or{' '}
                                            <Link href="/products" className="text-indigo-600 font-medium hover:text-indigo-500">
                                                Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
                            <div className="mt-6">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={cancelDelete}
                    ></div>

                    {/* Modal */}
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                            {/* Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-pink-100 mb-4">
                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Remove Item?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to remove this item from your cart? This action cannot be undone.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 border border-transparent rounded-xl text-white font-semibold hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Yes, Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
