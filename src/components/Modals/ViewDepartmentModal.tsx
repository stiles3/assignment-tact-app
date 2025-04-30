"use client";

import { FC, useState } from "react";
import { Pencil, Plus, Trash2, Check, X } from "lucide-react";
import { Button } from "../Buttons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useModal } from "@/providers/ModalProvider";
import { Input } from "../Inputs/TextInput";
import { useMutation } from "@apollo/client";
import {
  ADD_SUB_DEPARTMENT,
  DELETE_SUB_DEPARTMENT,
  UPDATE_DEPARTMENT,
  UPDATE_SUB_DEPARTMENT,
} from "@/hooks/department/queries";
import { ModalId } from "@/providers/ModalWrapper";

interface SubDepartment {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  subDepartments: SubDepartment[];
}

interface ViewDepartmentProps {
  modalId: string;
}

const ViewDepartmentModal: FC<ViewDepartmentProps> = ({ modalId }) => {
  const { modalStates, hideModal, showModal } = useModal();
  const [updateDepartment, { loading: updateLoading }] =
    useMutation(UPDATE_DEPARTMENT);
  const [addSubDepartment, { loading: addSubLoading }] =
    useMutation(ADD_SUB_DEPARTMENT);
  const [updateSubDepartment, { loading: updateSubLoading }] = useMutation(
    UPDATE_SUB_DEPARTMENT
  );
  const [deleteSubDepartment, { loading: deleteSubLoading }] = useMutation(
    DELETE_SUB_DEPARTMENT
  );

  const isOpen = modalStates[modalId]?.isOpen || false;
  const department = modalStates[modalId]?.props?.department as Department;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(department?.name || "");
  const [newSubDept, setNewSubDept] = useState("");
  const [editingSubDept, setEditingSubDept] = useState<SubDepartment | null>(
    null
  );

  const handleSaveName = async () => {
    if (department) {
      await updateDepartment({
        variables: {
          updateDepartmentInput: { id: department?.id, name: editName },
        },
      });
    }

    modalStates[modalId]?.props?.refetch();
    hideModal(modalId);
    setIsEditing(false);
  };

  const handleAddSubDepartment = async () => {
    if (newSubDept.trim() && department) {
      await addSubDepartment({
        variables: {
          createSubDepartmentInput: {
            departmentId: department?.id,
            name: newSubDept.trim(),
          },
        },
      });
      modalStates[modalId]?.props?.refetch();
      hideModal(modalId);
      setNewSubDept("");
    }
  };

  const handleUpdateSubDepartment = async () => {
    if (editingSubDept?.name.trim() && department) {
      await updateSubDepartment({
        variables: {
          updateSubDepartmentInput: {
            id: editingSubDept?.id,
            name: editingSubDept?.name.trim(),
          },
        },
      });
      modalStates[modalId]?.props?.refetch();
      hideModal(modalId);
      setEditingSubDept(null);
    }
  };

  const confirmDeleteSubDept = (subDeptId: string) => {
    showModal(ModalId.DELETE_CONFIRM, {
      title: "Delete Sub-Department",
      message: "Are you sure you want to delete this sub-department?",
      onConfirm: async () => {
        if (department) {
          await deleteSubDepartment({
            variables: { deleteDepartmentInput: { id: subDeptId } },
          });
          modalStates[modalId]?.props?.refetch();
          hideModal(modalId);
        }
      },
    });
  };

  if (!isOpen || !department) return null;

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10"
      onClose={() => hideModal(modalId)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Department Details</h2>
            <button
              onClick={() => hideModal(modalId)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Department Name Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleSaveName}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 border rounded">
                <span>{department?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditName(department?.name);
                    setIsEditing(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sub-Departments Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Sub-Departments</h3>
              <div className="flex gap-2">
                <Input
                  value={newSubDept}
                  onChange={(e) => setNewSubDept(e.target.value)}
                  placeholder="Add new sub-department"
                  className="w-48"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddSubDepartment()
                  }
                />
                <Button
                  size="sm"
                  onClick={handleAddSubDepartment}
                  disabled={!newSubDept.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sub-Departments List */}
            {department.subDepartments.length > 0 ? (
              <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                {department.subDepartments.map((subDept) => (
                  <div
                    key={subDept.id}
                    className="flex items-center justify-between p-3"
                  >
                    {editingSubDept?.id === subDept.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <Input
                          value={editingSubDept.name}
                          onChange={(e) =>
                            setEditingSubDept({
                              ...editingSubDept,
                              name: e.target.value,
                            })
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUpdateSubDepartment}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSubDept(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span>{subDept.name}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingSubDept(subDept)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDeleteSubDept(subDept.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic py-4 text-center border rounded">
                No sub-departments added yet
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ViewDepartmentModal;
