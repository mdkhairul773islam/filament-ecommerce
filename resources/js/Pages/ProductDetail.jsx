import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function ProductDetail({ auth, product, fbEventId }) {
    const [activeTab, setActiveTab] = useState('summary');
    const [isLookInsideOpen, setIsLookInsideOpen] = useState(false);

    useEffect(() => {
        if (typeof fbq !== 'undefined' && fbEventId) {
            fbq('track', 'ViewContent', {
                content_ids: [String(product.id)],
                content_name: product.name,
                content_type: 'product',
                value: parseFloat(product.final_price || product.price),
                currency: 'BDT',
            }, { eventID: fbEventId });
        }
    }, [fbEventId]);

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
                            <div className="w-full relative shadow-md rounded-lg overflow-hidden bg-white border border-gray-200">
                                {product.image ? (
                                    <div 
                                        className="relative group cursor-pointer"
                                        onClick={() => product.look_inside_type && setIsLookInsideOpen(true)}
                                    >
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                        
                                        {/* Look Inside Overlay */}
                                        {product.look_inside_type && (
                                            <div className="absolute top-0 inset-x-0 w-full bg-white bg-opacity-95 py-2 px-4 shadow text-center transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="text-red-500 font-bold flex items-center justify-center space-x-2">
                                                    <span>Look Inside</span>
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        {product.look_inside_type && (
                                            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md z-10 flex items-center space-x-1 outline outline-1 outline-gray-200">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 13H7v-2h2v2zm0-4H7V5h2v4z"/></svg>
                                                <span className="text-xs font-bold text-gray-700">Look Inside</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
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
                                    ৳{product.discount_price 
                                        ? (product.discount_type === 'flat' 
                                            ? (parseFloat(product.price) - parseFloat(product.discount_price)).toFixed(2)
                                            : (parseFloat(product.price) * (1 - parseFloat(product.discount_price) / 100)).toFixed(2)
                                          )
                                        : parseFloat(product.price).toFixed(2)
                                    }
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

                            <form onSubmit={addToCart} className="mt-10 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={processing || product.stock === 0}
                                    className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                
                                {product.look_inside_type && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsLookInsideOpen(true);
                                        }}
                                        className="flex-1 bg-white border-2 border-indigo-600 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Look Inside
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Dynamic Details block */}
                    <div className="mt-16 w-full text-left">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Product Details</h2>
                        
                        <div className="flex space-x-1 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={`px-6 py-3 border-b-2 font-medium text-sm focus:outline-none ${
                                    activeTab === 'summary'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Summary
                            </button>
                            <button
                                onClick={() => setActiveTab('specification')}
                                className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
                                    activeTab === 'specification'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Specification
                            </button>
                            <button
                                onClick={() => setActiveTab('author_details')}
                                className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
                                    activeTab === 'author_details'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Author
                            </button>
                        </div>

                        <div className="py-6 min-h-[200px]">
                            {activeTab === 'summary' && (
                                <div className="rokomari-content" dangerouslySetInnerHTML={{ __html: product.content || '<p>No summary provided for this product.</p>' }} />
                            )}
                            {activeTab === 'specification' && (
                                product.specification ? (
                                    <div className="rokomari-content" dangerouslySetInnerHTML={{ __html: product.specification }} />
                                ) : (
                                    <div className="text-gray-500 py-8 text-center italic border border-dashed border-gray-200 rounded-lg">Specification details have not been added yet.</div>
                                )
                            )}
                            {activeTab === 'author_details' && (
                                product.author_details ? (
                                    <div className="rokomari-content" dangerouslySetInnerHTML={{ __html: product.author_details }} />
                                ) : (
                                    <div className="text-gray-500 py-8 text-center italic border border-dashed border-gray-200 rounded-lg">Author details have not been added yet.</div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Look Inside Modal */}
            {isLookInsideOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsLookInsideOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                                <button 
                                    onClick={() => setIsLookInsideOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-2"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                <div className="mt-3 text-center sm:mt-0 sm:text-left h-[75vh] flex flex-col">
                                    <h3 className="text-xl font-bold leading-6 text-gray-900 mb-4" id="modal-title">
                                        Look Inside - {product.name}
                                    </h3>
                                    
                                    <div className="flex-1 w-full bg-gray-50 rounded border border-gray-200 overflow-y-auto">
                                        {product.look_inside_type === 'pdf' && product.look_inside_pdf && (
                                            <iframe src={`/storage/${product.look_inside_pdf}`} className="w-full h-full" title="PDF Preview"></iframe>
                                        )}
                                        {product.look_inside_type === 'text' && product.look_inside_text && (
                                            <div className="p-8 rokomari-content" dangerouslySetInnerHTML={{ __html: product.look_inside_text }}></div>
                                        )}
                                        {(!product.look_inside_type || (!product.look_inside_pdf && !product.look_inside_text)) && (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                No preview content available.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
