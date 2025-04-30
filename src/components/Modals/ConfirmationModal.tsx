"use client";
import { FC } from "react";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Button } from "../Buttons";
import { useModal } from "@/providers/ModalProvider";

interface ConfirmModalProps {
  modalId: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ modalId }) => {
  const { modalStates, hideModal } = useModal();
  const { title, message, onConfirm } = modalStates[modalId]?.props || {};

  if (!modalStates[modalId]?.isOpen) return null;

  return (
    <Dialog
      open={true}
      as="div"
      className="relative z-10"
      onClose={() => hideModal(modalId)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => hideModal(modalId)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm?.();
                hideModal(modalId);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmModal;
