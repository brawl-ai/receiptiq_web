import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ReceiptResponse } from '../../../types';
import {
    IconZoomIn,
    IconZoomOut,
    IconZoomReset,
    IconX
} from '@tabler/icons-react';

const PDFViewer = dynamic(() => import('../components/PDFViewer'), {
    ssr: false,
    loading: () => <p>Loading PDF viewer...</p>
});

interface ImageViewerDrawerProps {
    opened: boolean;
    onClose: () => void;
    receipt: ReceiptResponse;
    title?: string;
}

export default function ReceiptViewerDrawer({
    opened,
    onClose,
    receipt,
    title = "Image Viewer"
}: ImageViewerDrawerProps) {
    const [imageLoading, setImageLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (opened) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setImageLoading(true);
        }
    }, [opened, receipt]);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev * 1.2, 5));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev / 1.2, 0.1));
    };

    const handleZoomReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(prev => Math.min(Math.max(prev * delta, 0.1), 5));
    };

    return (
        opened ? (<div className='fixed w-full inset-0 z-50 overflow-y-auto items-center justify-center'>
            {/* Backdrop */}
            <div
                className="fixed w-full inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div className="fixed right-0 top-0 h-screen w-full bg-background border-l border-border shadow-xl flex flex-col p-0">
                {/* Controls */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleZoomIn}
                            title="Zoom In"
                            data-umami-event="zoom_in@projects_imageviewer"
                        >
                            <IconZoomIn size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleZoomOut}
                            title="Zoom Out"
                            data-umami-event="zoom_out@projects_imageviewer"
                        >
                            <IconZoomOut size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleZoomReset}
                            title="Reset Zoom"
                            data-umami-event="zoom_reset@projects_imageviewer"
                        >
                            <IconZoomReset size={18} />
                        </Button>
                        <span className="text-sm text-muted-foreground ml-2">{Math.round(scale * 100)}%</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        title="Close"
                        data-umami-event="close@projects_imageviewer"
                    >
                        <IconX size={18} />
                    </Button>
                </div>

                {/* Image Viewport */}
                <div
                    ref={viewportRef}
                    className="flex-1 relative overflow-hidden bg-background"
                    style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    <div
                        className="absolute top-1/2 left-1/2"
                        style={{
                            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                            transformOrigin: 'center center',
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            userSelect: 'none',
                            pointerEvents: imageLoading ? 'none' : 'auto',
                        }}
                    >
                        {receipt?.mime_type.includes("image") && (
                            <img
                                src={receipt?.download_url}
                                alt="Viewer Image"
                                onLoad={handleImageLoad}
                                onError={() => setImageLoading(false)}
                                className="max-w-[90vw] max-h-[90vh] block"
                                draggable={false}
                            />
                        )}
                        {receipt?.mime_type.includes("pdf") && (
                            <PDFViewer
                                onErrorAction={() => setImageLoading(false)}
                                onLoadAction={handleImageLoad}
                                pdfUrl={receipt?.download_url}
                            />
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="flex justify-center p-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                        Use mouse wheel to zoom • Click and drag to pan when zoomed
                    </span>
                </div>
            </div>
        </div>) : null
    );
}