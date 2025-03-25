import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-tv-bg-secondary rounded-lg p-6 max-w-md w-full mx-4 border border-tv-border">
        <p className="text-tv-text-primary mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-tv-text-secondary hover:text-tv-text-primary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-tv-red text-white rounded-lg hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}