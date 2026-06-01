import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';

export default function Page({ title, content, slug }) {
    useEffect(() => {
        if (typeof fbq !== 'undefined' && slug && slug.toLowerCase().includes('contact')) {
            fbq('track', 'Lead', {
                content_name: title,
            });
        }
    }, [slug]);
    return (
        <Layout>
            <Head title={title} />
            <div className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
                    <div 
                        className="prose prose-blue max-w-none text-gray-700" 
                        dangerouslySetInnerHTML={{ __html: content }} 
                    />
                </div>
            </div>
        </Layout>
    );
}