"use client";
import { FC, useState } from "react";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "../Buttons";
import { useModal } from "@/providers/ModalProvider";
import { Input } from "../Inputs/TextInput";
import { CREATE_DEPARTMENT } from "@/hooks/department/queries";
import { useMutation } from "@apollo/client";

interface AddDepartmentModalProps {
  modalId: string;
}

const AddDepartmentModal: FC<AddDepartmentModalProps> = ({ modalId }) => {
  const { modalStates, hideModal } = useModal();
  const isOpen = modalStates[modalId]?.isOpen || false;
  const [createDepartment, { data, loading, error }] =
    useMutation(CREATE_DEPARTMENT);

  const [department, setDepartment] = useState({
    name: "",
    subDepartments: [] as any[],
  });
  const [newSubDept, setNewSubDept] = useState("");

  const handleAddSubDepartment = () => {
    if (newSubDept.trim()) {
      setDepartment({
        ...department,
        subDepartments: [
          ...department.subDepartments,
          { name: newSubDept.trim() },
        ],
      });
      setNewSubDept("");
    }
  };

  const handleRemoveSubDepartment = (index: number) => {
    const updatedSubDepts = department.subDepartments.filter(
      (_, i) => i !== index
    );
    setDepartment({ ...department, subDepartments: updatedSubDepts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDepartment({
      variables: { createDepartmentInput: department },
    });
    modalStates[modalId]?.props?.refetch();
    setDepartment({ name: "", subDepartments: [] });
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Department</h2>
            <button
              onClick={() => hideModal(modalId)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Department Name */}
            <div>
              <label
                htmlFor="dept-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department Name *
              </label>
              <Input
                id="dept-name"
                value={department.name}
                onChange={(e) =>
                  setDepartment({ ...department, name: e.target.value })
                }
                placeholder="e.g. Human Resources"
                required
              />
            </div>

            {/* Sub-Departments Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Sub-Departments
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newSubDept}
                    onChange={(e) => setNewSubDept(e.target.value)}
                    placeholder="Add sub-department"
                    className="w-40"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddSubDepartment()
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
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
                <div className="border rounded-md divide-y max-h-40 overflow-y-auto">
                  {department.subDepartments.map((subDept, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2"
                    >
                      <span className="text-sm">{subDept.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubDepartment(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic py-2 text-center">
                  No sub-departments added yet
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => hideModal(modalId)}
              >
                Cancel
              </Button>
              <Button loading={loading} type="submit">
                Add department
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddDepartmentModal;
