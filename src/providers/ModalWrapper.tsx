import LogoutModal from "@/components/Modals/LogoutModal";
import { ModalProvider } from "./ModalProvider";
import AddDepartmentModal from "@/components/Modals/AddDepartmentModal";
import ViewDepartmentModal from "@/components/Modals/ViewDepartmentModal";
import ConfirmModal from "@/components/Modals/ConfirmationModal";

export enum ModalId {
  LOGOUT_MODAL = "logout",
  ADD_DEPARMENT = "add_department",
  VIEW_DEPARTMENT = "view_department",
  DELETE_CONFIRM = "delete_confirm",
}

const ModalWrapper: React.FC<any> = ({ children }) => {
  return (
    <ModalProvider>
      <LogoutModal modalId={ModalId.LOGOUT_MODAL} />
      <AddDepartmentModal modalId={ModalId.ADD_DEPARMENT} />
      <ViewDepartmentModal modalId={ModalId.VIEW_DEPARTMENT} />
      <ConfirmModal modalId={ModalId.DELETE_CONFIRM} />
      {children}
    </ModalProvider>
  );
};

export default ModalWrapper;
