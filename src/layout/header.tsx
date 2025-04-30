import React from "react";
import { LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/Buttons";
import { useModal } from "@/providers/ModalProvider";
import { ModalId } from "@/providers/ModalWrapper";

const Header: React.FC = () => {
  const { showModal } = useModal();
  const handleLogout = () => {
    showModal(ModalId.LOGOUT_MODAL);
  };

  return (
    <header className="bg-white border-b border-gray-200 w-full mb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-semibold text-gray-900">
              DepartmentOS
            </span>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut size={18} className="inline-flex mr-1 items center" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
