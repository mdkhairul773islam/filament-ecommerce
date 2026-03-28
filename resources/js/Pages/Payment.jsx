import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function Payment({ order, paymentMethod }) {
    const { data, setData, post, processing } = useForm({
        transaction_reference: '',
    });

    const handleConfirm = (e) => {
        e.preventDefault();
        post(`/payment/${order.id}/confirm`);
    };

    const getPaymentInstructions = () => {
        switch (paymentMethod?.code) {
            case 'bkash':
                return {
                    steps: [
                        'Open your bKash app',
                        'Select "Send Money"',
                        'Enter merchant number: 01XXXXXXXXX',
                        `Enter amount: ৳${order.total}`,
                        'Enter your PIN and confirm',
                        'Note down the transaction ID',
                        'Enter the transaction ID below and click "Confirm Payment"'
                    ],
                    color: 'bg-pink-50 border-pink-200',
                    iconColor: 'text-pink-600'
                };
            case 'rocket':
                return {
                    steps: [
                        'Dial *322# from your mobile',
                        'Select "Payment"',
                        'Enter merchant number: 01XXXXXXXXX',
                        `Enter amount: ৳${order.total}`,
                        'Enter your PIN and confirm',
                        'Note down the transaction ID',
                        'Enter the transaction ID below and click "Confirm Payment"'
                    ],
                    color: 'bg-purple-50 border-purple-200',
                    iconColor: 'text-purple-600'
                };
            case 'nagad':
                return {
                    steps: [
                        'Open your Nagad app',
                        'Select "Send Money"',
                        'Enter merchant number: 01XXXXXXXXX',
                        `Enter amount: ৳${order.total}`,
                        'Enter your PIN and confirm',
                        'Note down the transaction ID',
                        'Enter the transaction ID below and click "Confirm Payment"'
                    ],
                    color: 'bg-orange-50 border-orange-200',
                    iconColor: 'text-orange-600'
                };
            case 'cash':
                return {
                    steps: [
                        'Your order has been placed successfully',
                        'You will pay with cash when you receive your order',
                        'Our delivery person will contact you soon',
                        'Please keep the exact amount ready',
                        'Click "Confirm Order" below to proceed'
                    ],
                    color: 'bg-green-50 border-green-200',
                    iconColor: 'text-green-600'
                };
            default:
                return {
                    steps: ['Complete your payment and confirm below'],
                    color: 'bg-gray-50 border-gray-200',
                    iconColor: 'text-gray-600'
                };
        }
    };

    const instructions = getPaymentInstructions();
    const isCashOnDelivery = paymentMethod?.code === 'cash';

    return (
        <Layout>
            <Head title="Complete Payment" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                    Order Placed Successfully!
                                </h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>Order Number: <span className="font-semibold">{order.order_number}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">
                                {isCashOnDelivery ? 'Order Confirmation' : 'Complete Your Payment'}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Payment Method: <span className="font-semibold">{paymentMethod?.name}</span>
                            </p>
                        </div>

                        <div className={`px-6 py-6 border-2 ${instructions.color}`}>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className={`shrink-0 ${instructions.iconColor}`}>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {isCashOnDelivery ? 'Instructions:' : 'Follow these steps:'}
                                        </h3>
                                        <div className="mt-2">
                                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                                {instructions.steps.map((step, index) => (
                                                    <li key={index}>{step}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="px-6 py-4 bg-gray-50">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium text-gray-900">৳{order.subtotal}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount:</span>
                                        <span className="font-medium text-green-600">-৳{order.discount}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-2 flex justify-between">
                                    <span className="text-base font-medium text-gray-900">Total:</span>
                                    <span className="text-base font-bold text-gray-900">৳{order.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Confirmation Form */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={handleConfirm} className="space-y-6">
                            {!isCashOnDelivery && (
                                <div>
                                    <label htmlFor="transaction_reference" className="block text-sm font-medium text-gray-700">
                                        Transaction ID / Reference Number
                                    </label>
                                    <input
                                        type="text"
                                        id="transaction_reference"
                                        value={data.transaction_reference}
                                        onChange={(e) => setData('transaction_reference', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter your transaction ID"
                                        required={!isCashOnDelivery}
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Please enter the transaction ID you received after payment
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between space-x-4">
                                <Link
                                    href={`/orders/${order.order_number}`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Pay Later
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Confirming...' : (isCashOnDelivery ? 'Confirm Order' : 'Confirm Payment')}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <p className="text-xs text-gray-500 text-center">
                                By confirming, you agree that you have {isCashOnDelivery ? 'reviewed' : 'completed'} the payment.
                                {!isCashOnDelivery && ' We will verify your payment within 24 hours.'}
                            </p>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Need help?{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
