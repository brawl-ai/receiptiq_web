'use client';

import { useEffect, useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Group, Text, Box } from '@mantine/core';
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
            <Box p="md" style={{ textAlign: 'center' }}>
                <Text c="red">Error: {error}</Text>
            </Box>
        );
    }

    return (
        <Box style={{ position: 'relative' }}>
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
                <Group justify="center" mt="md">
                    <Button
                        onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                        disabled={pageNumber <= 1}
                        data-umami-event="previous@projects_pdfviewer"
                    >
                        Previous
                    </Button>

                    <Text>
                        Page {pageNumber} of {numPages}
                    </Text>

                    <Button
                        data-umami-event="next@projects_pdfviewer"
                        onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                        disabled={pageNumber >= numPages}
                    >
                        Next
                    </Button>
                </Group>
            )}
        </Box>
    );
}