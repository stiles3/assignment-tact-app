"use client";
import { FC } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Button } from "../Buttons";
import { LogOut, X } from "lucide-react";
import { useModal } from "@/providers/ModalProvider";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

interface ModalComponentProps {
  modalId: string;
}

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser {
      status
      message
    }
  }
`;

const LogoutModal: FC<ModalComponentProps> = ({ modalId }) => {
  const router = useRouter();
  const [logoutMutation] = useMutation(LOGOUT_USER);
  const { modalStates, hideModal } = useModal();
  const isOpen = modalStates[modalId]?.isOpen;

  const logoutUser = async () => {
    await logoutMutation();
    router.push("/login");
    hideModal(modalId);
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => hideModal(modalId)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-red-100 p-3">
              <LogOut className="h-6 w-6 text-red-500" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Logout
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to sign out? You'll need to log in again
                to access your account.
              </p>
            </div>

            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => hideModal(modalId)}
              >
                Cancel
              </Button>
              <Button size="sm" className="w-full" onClick={logoutUser}>
                Logout
              </Button>
            </div>
          </div>

          <button
            type="button"
            className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => hideModal(modalId)}
          >
            <X className="h-5 w-5" />
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default LogoutModal;
