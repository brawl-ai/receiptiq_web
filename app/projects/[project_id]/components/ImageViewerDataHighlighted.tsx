import React, { useState, useRef, useEffect } from 'react';
import {
    Drawer,
    Image,
    LoadingOverlay,
    ActionIcon,
    Group,
    Text,
    Box,
    Stack,
    Flex,
    Divider
} from '@mantine/core';
import {
    IconZoomIn,
    IconZoomOut,
    IconZoomReset,
    IconX
} from '@tabler/icons-react';
import { DataValueResponse, DataValueUpdate, FieldResponse, ReceiptResponse } from '../../../lib/types';
import DataForm from './DataForm';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
    ssr: false,
    loading: () => <p>Loading PDF viewer...</p>
});

interface ImageViewerDrawerProps {
    opened: boolean;
    fields: FieldResponse[];
    onClose: () => void;
    onUpdate: (receiptId: string, dataValueId: string, data: DataValueUpdate) => Promise<DataValueResponse>;
    receipt: ReceiptResponse;
}

export default function ImageViewerDataHighlighted({
    opened,
    fields,
    onClose,
    onUpdate,
    receipt,
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
    }, [opened]);

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
        // Unable to preventDefault inside passive event listener invocation. e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(prev => Math.min(Math.max(prev * delta, 0.1), 5));
    };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            size="100%"
            position="right"
            styles={{
                body: { padding: 0, height: '100%' },
                content: { height: '100vh' }
            }}
            withCloseButton={false}
            offset={20}
            radius="lg"
        >
            <Flex direction={"row"} justify={"center"} w={"100%"} h={"100%"}>
                <DataForm receipt={receipt} fields={fields} onUpdate={onUpdate} />
                <Divider orientation='vertical' variant='dotted' />
                <Stack h="100%" style={{ flex: 1 }}>
                    {/* Controls */}
                    <Group justify="space-between" p="md" h={50}>
                        <Group gap="xs">
                            <ActionIcon
                                data-umami-event="zoom_in@projects_imageviewer"
                                variant="light"
                                onClick={handleZoomIn}
                                title="Zoom In"
                            >
                                <IconZoomIn size={16} />
                            </ActionIcon>
                            <ActionIcon
                                data-umami-event="zoom_out@projects_imageviewer"
                                variant="light"
                                onClick={handleZoomOut}
                                title="Zoom Out"
                            >
                                <IconZoomOut size={16} />
                            </ActionIcon>
                            <ActionIcon
                                data-umami-event="zoom_reset@projects_imageviewer"
                                variant="light"
                                onClick={handleZoomReset}
                                title="Reset Zoom"
                            >
                                <IconZoomReset size={16} />
                            </ActionIcon>
                            <Text size="sm" c="dimmed">
                                {Math.round(scale * 100)}%
                            </Text>
                        </Group>
                        <ActionIcon
                            data-umami-event="close@projects_imageviewer"
                            variant="light"
                            onClick={onClose}
                            title="Close"
                        >
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>

                    {/* Image Viewport */}
                    <Box
                        ref={viewportRef}
                        style={{
                            flex: 1,
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                    >
                        <LoadingOverlay
                            visible={imageLoading}
                            overlayProps={{ blur: 2 }}
                        />

                        <Box
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
                            <Box style={{ position: 'relative', display: 'inline-block' }}>
                                {receipt?.mime_type.includes("image") && <Image
                                    src={receipt?.download_url}
                                    alt="Viewer Image"
                                    onLoad={handleImageLoad}
                                    onError={() => setImageLoading(false)}
                                    style={{
                                        maxWidth: '90vw',
                                        maxHeight: '90vh',
                                        display: 'block'
                                    }}
                                    styles={{
                                        root: { display: 'block' }
                                    }}
                                />}

                                {receipt?.mime_type.includes("pdf") && <PDFViewer
                                    onErrorAction={() => setImageLoading(false)}
                                    onLoadAction={handleImageLoad}
                                    pdfUrl={receipt?.download_url}
                                />}

                                {/* Overlay boxes for data values - positioned relative to image */}
                                {receipt?.data_values.map((dataValue) => (
                                    <Box
                                        key={dataValue.id}
                                        style={{
                                            position: 'absolute',
                                            left: `${dataValue.x}px`,
                                            top: `${dataValue.y}px`,
                                            width: `${dataValue.width}px`,
                                            height: `${dataValue.height}px`,
                                            border: '2px solid #ff6b6b',
                                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                            pointerEvents: 'none',
                                            borderRadius: '2px',
                                        }}
                                        title={`${dataValue.field.name}: ${dataValue.value}`}
                                    >
                                        {/* Optional: Add field name label */}
                                        <Box
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
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                    {/* Instructions */}
                    <Group justify="center" p="xs">
                        <Text size="xs" c="dimmed">
                            Use mouse wheel to zoom • Click and drag to pan when zoomed
                        </Text>
                    </Group>
                </Stack>
            </Flex>
        </Drawer>
    );
}