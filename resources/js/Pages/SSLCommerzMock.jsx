import { Head } from '@inertiajs/react';

export default function SSLCommerzMock({ order, successUrl, failUrl, cancelUrl }) {
    return (
        <>
            <Head title="SSLCommerz Payment (Test Mode)" />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#1a1f6b] py-5 px-6 flex items-center justify-between">
                        <div>
                            <p className="text-white font-extrabold text-xl tracking-wide">SSLCommerz</p>
                            <p className="text-blue-200 text-xs mt-0.5">Secure Payment Gateway</p>
                        </div>
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                            TEST MODE
                        </span>
                    </div>

                    {/* Order info */}
                    <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Order</p>
                                <p className="font-bold text-gray-800">{order.order_number}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                                <p className="font-extrabold text-xl text-[#1a1f6b]">৳{parseFloat(order.total).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mock notice */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-yellow-50">
                        <p className="text-yellow-800 text-sm font-semibold text-center">
                            ⚠️ এটি একটি Test / Sandbox পেমেন্ট পেজ।
                        </p>
                        <p className="text-yellow-700 text-xs text-center mt-1">
                            Real production credentials দিলে এখানে আসল SSLCommerz interface দেখাবে।
                        </p>
                    </div>

                    {/* Mock payment options */}
                    <div className="px-6 py-6 space-y-3">
                        <p className="text-center text-sm text-gray-500 font-medium mb-4">
                            পেমেন্ট সিমুলেট করুন:
                        </p>

                        {/* Success */}
                        <a
                            href={successUrl}
                            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-base py-4 rounded-xl transition-all shadow"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            পেমেন্ট সফল (Simulate Success)
                        </a>

                        {/* Fail */}
                        <a
                            href={failUrl}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-base py-4 rounded-xl transition-all shadow"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            পেমেন্ট ব্যর্থ (Simulate Fail)
                        </a>

                        {/* Cancel */}
                        <a
                            href={cancelUrl}
                            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-base py-3 rounded-xl transition-all"
                        >
                            বাতিল করুন (Cancel)
                        </a>
                    </div>

                    <div className="px-6 pb-5 text-center text-xs text-gray-400">
                        Powered by SSLCommerz &mdash; Test Sandbox
                    </div>
                </div>
            </div>
        </>
    );
}
