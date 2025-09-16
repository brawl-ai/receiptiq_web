import React, { useState, useRef, useEffect } from 'react';
import { IconZoomIn, IconZoomOut, IconZoomReset, IconX } from '@tabler/icons-react';
import { DataValueResponse, DataValueUpdate, FieldResponse, ReceiptResponse } from '../../../types';
import DataForm from './DataForm';
import dynamic from 'next/dynamic';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import ReceiptViewer from './ReceiptViewer';


interface ReceiptAndDataViewerProps {
    opened: boolean;
    fields: FieldResponse[];
    onClose: () => void;
    onUpdate: (receiptId: string, dataValueId: string, data: DataValueUpdate) => Promise<DataValueResponse>;
    receipt: ReceiptResponse;
}

export default function ReceiptAndDataDrawer({ opened, fields, onClose, onUpdate, receipt }: ReceiptAndDataViewerProps) {
    return opened ? (
        <div
            className='fixed inset-0 z-50 overflow-y-auto flex items-center justify-center'
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div className="relative h-full w-full flex flex-row bg-background rounded-lg shadow-xl transform transition-all">
                <DataForm receipt={receipt} fields={fields} onUpdate={onUpdate} />
                <Separator orientation='vertical' decorative />
                <ReceiptViewer receipt={receipt} onClose={onClose} />
            </div>
        </div>) : null
}