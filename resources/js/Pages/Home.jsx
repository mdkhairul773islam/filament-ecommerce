import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home({ auth, featuredProducts, categories, sliders }) {
    return (
        <Layout>
            <Head title="Home" />

            {/* Hero Slider Section */}
            {sliders && sliders.length > 0 ? (
                <div className="relative w-full h-[500px] md:h-[600px] bg-indigo-900 overflow-hidden">
                    <Swiper
                        spaceBetween={0}
                        centeredSlides={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="w-full h-full"
                    >
                        {sliders.map((slider) => (
                            <SwiperSlide key={slider.id} className="relative w-full h-full flex items-center">
                                {/* Background Image/Video */}
                                {slider.video ? (
                                    <video 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60" 
                                        src={`/storage/${slider.video}`} 
                                        autoPlay loop muted playsInline 
                                    />
                                ) : slider.image ? (
                                    <img 
                                        src={`/storage/${slider.image}`} 
                                        alt={slider.title} 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60" 
                                    />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full bg-indigo-600 opacity-60" />
                                )}

                                {/* Overlay Content */}
                                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-[80%] justify-center">
                                    <div className="sm:text-center lg:text-left pt-10 md:pt-16">
                                        {slider.title && (
                                            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-lg">
                                                {slider.title}
                                            </h1>
                                        )}
                                        {slider.description && (
                                            <p className="mt-4 text-base text-white sm:mt-6 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-6 md:text-xl lg:mx-0 drop-shadow-md min-h-[3rem]">
                                                {slider.description}
                                            </p>
                                        )}
                                        {slider.button_text && (
                                            <div className="mt-10 sm:mt-12 md:mt-16 sm:flex sm:justify-center lg:justify-start">
                                                <div className="rounded-md shadow hover:shadow-lg transition-shadow">
                                                    <Link href={slider.button_link || '#'} className="w-full flex items-center justify-center px-8 py-3 lg:py-4 border border-transparent text-base font-semibold rounded-md text-indigo-700 bg-white hover:bg-gray-100 md:text-lg md:px-10 transition-colors">
                                                        {slider.button_text}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <div className="relative bg-indigo-600 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div className="sm:text-center lg:text-left">
                                    <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                        <span className="block">Learn from the</span>
                                        <span className="block text-indigo-200">best resources</span>
                                    </h1>
                                    <p className="mt-3 text-base text-indigo-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        Discover our collection of books and courses. Get access to premium educational content.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <Link href="/products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                                                Browse Products
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {categories?.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{category.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Featured Products</h2>
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {featuredProducts?.map((product) => (
                            <div key={product.id} className="group relative">
                                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                    <Link href={`/products/${product.slug}`}>
                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="w-full h-48 object-center object-cover group-hover:opacity-75"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
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
                                    <p className="mt-1 text-sm text-gray-500">{product.type}</p>
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
                </div>
            </div>
        </Layout>
    );
}
