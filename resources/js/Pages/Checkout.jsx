import { Head, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function Checkout({ auth, cart, paymentMethods }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: auth?.user?.name || '',
        customer_email: auth?.user?.email || '',
        customer_phone: '',
        customer_address: '',
        payment_method: paymentMethods?.[0]?.code || 'bkash',
        notes: '',
    });

    const total = cart?.items?.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0) || 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <Layout>
            <Head title="Checkout" />

            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="customer_name"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    {errors.customer_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="customer_email"
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    {errors.customer_email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.customer_email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="customer_phone"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    {errors.customer_phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.customer_phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="customer_address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <textarea
                                        id="customer_address"
                                        rows={3}
                                        value={data.customer_address}
                                        onChange={(e) => setData('customer_address', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.customer_address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.customer_address}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                                        Payment Method
                                    </label>
                                    <select
                                        id="payment_method"
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        {paymentMethods?.map((method) => (
                                            <option key={method.id} value={method.code}>
                                                {method.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.payment_method && (
                                        <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                                    )}
                                    {paymentMethods?.find(m => m.code === data.payment_method)?.description && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {paymentMethods.find(m => m.code === data.payment_method).description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Order Notes (Optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Any special instructions?"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

                            <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6">
                                <ul className="divide-y divide-gray-200">
                                    {cart?.items?.map((item) => (
                                        <li key={item.id} className="py-4 flex">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {item.product?.name}
                                                </h4>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                ৳{item.price * item.quantity}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Total</p>
                                        <p>৳{total.toFixed(2)}</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !cart?.items?.length}
                                    className="w-full mt-6 bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
