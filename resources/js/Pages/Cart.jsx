import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function Cart({ auth, cart }) {
    const { delete: destroy } = useForm();

    const removeFromCart = (itemId) => {
        if (confirm('Are you sure you want to remove this item?')) {
            destroy(`/cart/${itemId}`);
        }
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return;
        useForm({ quantity }).patch(`/cart/${itemId}`);
    };

    const total = cart?.items?.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
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
                                                        <p className="ml-4">৳{item.price * item.quantity}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500 capitalize">
                                                        {item.product?.type}
                                                    </p>
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                    <div className="flex items-center">
                                                        <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-700">
                                                            Qty:
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`quantity-${item.id}`}
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                            className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
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
        </Layout>
    );
}
