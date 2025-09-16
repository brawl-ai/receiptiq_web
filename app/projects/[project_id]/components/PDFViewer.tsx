'use client';

import { useEffect, useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    pdfUrl: string;
    onErrorAction: () => void;
    onLoadAction: () => void;
}

export default function PDFViewer({ pdfUrl, onErrorAction, onLoadAction }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Memoize options to prevent unnecessary reloads
    const options = useMemo(() => ({
        cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
    }), []);

    useEffect(() => {
        const fetchPDF = async () => {
            onLoadAction();
            onErrorAction();
            setPdfData(null);

            try {
                const response = await fetch(pdfUrl, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                setPdfData(arrayBuffer);
            } catch (err) {
                console.log(err)
                onErrorAction();
            } finally {
                onLoadAction();
            }
        };

        if (pdfUrl) {
            fetchPDF();
        }
    }, [pdfUrl, onErrorAction, onLoadAction]); // Add pdfUrl to dependency array

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setPageNumber(1); // Reset to first page when new document loads
    }

    function onDocumentLoadError(error: Error): void {
        setError(`Failed to load PDF: ${error.message}`);
        onLoadAction();
    }

    if (error) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {pdfData && (
                <Document
                    file={pdfData}
                    options={options}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<div>Loading PDF...</div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        width={800}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                    />
                </Document>
            )}

            {numPages > 0 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <Button
                        onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                        disabled={pageNumber <= 1}
                        data-umami-event="previous@projects_pdfviewer"
                        variant="outline"
                    >
                        Previous
                    </Button>

                    <p className="text-sm text-muted-foreground">
                        Page {pageNumber} of {numPages}
                    </p>

                    <Button
                        data-umami-event="next@projects_pdfviewer"
                        onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                        disabled={pageNumber >= numPages}
                        variant="outline"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}