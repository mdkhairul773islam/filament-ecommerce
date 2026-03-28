import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <Layout>
            <Head title="Dashboard" />

            <div className="bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {auth.user.name}!
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Manage your orders and account settings from your dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* My Orders Card */}
                        <Link
                            href="/orders"
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="shrink-0 bg-indigo-500 rounded-md p-3">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                My Orders
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                View all orders
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Profile Card */}
                        <Link
                            href="/profile"
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="shrink-0 bg-green-500 rounded-md p-3">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                My Profile
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                Update info
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Browse Products Card */}
                        <Link
                            href="/products"
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="shrink-0 bg-purple-500 rounded-md p-3">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Browse Products
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                Shop now
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Quick Info */}
                    <div className="mt-8 bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium text-gray-900">{auth.user.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium text-gray-900">{auth.user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Member since:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(auth.user.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
