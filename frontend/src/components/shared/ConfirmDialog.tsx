import React from 'react';
import { Modal, ModalProps } from './Modal';
import { AlertTriangle, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface ConfirmDialogProps extends Omit<ModalProps, 'children'> {
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  size = 'sm'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className={clsx(
            'p-3 rounded-full flex-shrink-0',
            isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
          )}>
            {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
          </div>
          <p className="text-gray-300 pt-1 leading-relaxed">{message}</p>
        </div>
        
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={clsx(
              'px-4 py-2 font-medium text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 flex items-center justify-center min-w-[100px]',
              isDestructive 
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                : 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500'
            )}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
