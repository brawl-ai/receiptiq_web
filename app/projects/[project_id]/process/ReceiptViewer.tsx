import { ReceiptResponse } from "@/app/types";
import { Button } from "@/components/ui/button";
import { IconX, IconZoomIn, IconZoomOut, IconZoomReset } from "@tabler/icons-react";
import { useRef, useState } from "react";
import PDFViewer from "../components/PDFViewer";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";


export default function ReceiptViewer({ receipt, onClose }: { receipt: ReceiptResponse, onClose: () => void }) {
    const [imgDims, setImgDims] = useState({ naturalW: 1, naturalH: 1, renderedW: 1, renderedH: 1 });
    const imgRef = useRef<HTMLImageElement>(null);
    const [scale, setScale] = useState<number>(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imageLoading, setImageLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [boundingBox, setBoundingBox] = useState(false)

    const handleImageLoad = () => {
        if (imgRef.current) {
            setImgDims({
                naturalW: imgRef.current.naturalWidth,
                naturalH: imgRef.current.naturalHeight,
                renderedW: imgRef.current.clientWidth,
                renderedH: imgRef.current.clientHeight,
            });
        }
        setImageLoading(false);
    };


    const handleZoomIn = () => {
        setScale(prev => Math.min(prev * 1.2, 5));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev / 1.2, 0.1));
    }

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

    const scaleX = imgDims.renderedW / imgDims.naturalW;
    const scaleY = imgDims.renderedH / imgDims.naturalH;

    return (
        <div className='flex-1 flex flex-col h-full w-full p-5'>

            {/* Controls */}
            <div className='flex justify-between h-10'>
                <div className='flex gap-xs'>
                    <Button
                        data-umami-event="zoom_in@projects_imageviewer"
                        onClick={handleZoomIn}
                        title="Zoom In"
                        className="bg-transparent hover:bg-background/80"
                    >
                        <IconZoomIn className="text-foreground" size={16} />
                    </Button>
                    <Button
                        data-umami-event="zoom_out@projects_imageviewer"
                        onClick={handleZoomOut}
                        title="Zoom Out"
                        className="bg-background hover:bg-background/80"
                    >
                        <IconZoomOut className="text-foreground" size={16} />
                    </Button>
                    <Button
                        data-umami-event="zoom_reset@projects_imageviewer"
                        onClick={handleZoomReset}
                        title="Reset Zoom"
                        className="bg-background hover:bg-background/80"
                    >
                        <IconZoomReset className="text-foreground" size={16} />
                    </Button>
                    <div className='text-sm text-foreground flex items-center px-2 select-none'>
                        {Math.round(scale * 100)}%
                    </div>
                </div>
                <div className="flex items-center space-x-2" onClick={() => setBoundingBox(!boundingBox)}>
                    <Switch id="airplane-mode" disabled />
                    <Label htmlFor="airplane-mode" className="text-xs text-teal-700">Bounding Boxes (upcoming!) </Label>
                </div>
                <Button
                    data-umami-event="close@projects_imageviewer"
                    onClick={onClose}
                    title="Close"
                    className="bg-background hover:bg-background/80"
                >
                    <IconX className="text-primary" size={16} />
                </Button>
            </div>

            {/* Image Viewport */}
            <div className={"relative flex flex-col flex-1 overflow-hidden " + (imageLoading ? "bg-background/50" : "bg-background") + (scale > 1 ? (isDragging ? " cursor-grabbing" : " cursor-grab") : "cursor-default")}
                ref={viewportRef}
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
                <div className="flex justify-center items-center h-full min-h-[400px]"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        userSelect: 'none',
                        pointerEvents: imageLoading ? 'none' : 'auto'
                    }}
                >
                    {/* Container for image and overlays */}
                    <div className='relative w-fit-content'>
                        {receipt?.mime_type.includes("image") && <Image
                            src={receipt?.download_url}
                            width={300}
                            height={300}
                            ref={imgRef}
                            alt="Viewer Image"
                            onLoad={handleImageLoad}
                            onError={() => setImageLoading(false)}
                            draggable={false}
                            unoptimized
                        />}

                        {receipt?.mime_type.includes("pdf") && <PDFViewer
                            onErrorAction={() => setImageLoading(false)}
                            onLoadAction={() => setImageLoading(false)}
                            pdfUrl={receipt?.download_url}
                        />}

                        {/* Overlay boxes for data values - positioned relative to image */}
                        {boundingBox && receipt?.data_values.map((dataValue) => (
                            <div className='absolute'
                                key={dataValue.id}
                                style={{
                                    left: dataValue.x * scaleX,
                                    top: dataValue.y * scaleY,
                                    width: dataValue.width * scaleX,
                                    height: dataValue.height * scaleY,
                                    border: '2px solid #ff6b6b',
                                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                    pointerEvents: 'none',
                                    borderRadius: '2px',
                                }}
                                title={`${dataValue.field.name}: ${dataValue.value}`}
                            >
                                {/* Optional: Add field name label */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        left: '0',
                                        fontSize: '10px',
                                        backgroundColor: '#ff6b6b',
                                        color: 'white',
                                        padding: '2px 4px',
                                        borderRadius: '2px',
                                        whiteSpace: 'nowrap',
                                        transform: 'scale(0.8)',
                                        transformOrigin: 'left top',
                                    }}
                                >
                                    {dataValue.field.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Instructions */}
                <div className="flex justify-center p-2">
                    <div className="text-xs text-muted-foreground">
                        {/* Use mouse wheel to zoom • Click and drag to pan when zoomed */}
                    </div>
                </div>
            </div>
        </div>
    );
}