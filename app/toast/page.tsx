"use client"
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewerComponent'), {
    ssr: false,
    loading: () => <p>Loading PDF viewer...</p>
});

export default function ToastPage() {
    return (
        <div>
            <PDFViewer />
        </div>
    );
}