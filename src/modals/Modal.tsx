import React from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    children
}) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                {children ? (
                    children
                ) : (
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded"
                        >
                            {t('delete.cancel')}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            {t('delete.confirm')}
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};