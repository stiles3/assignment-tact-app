"use client";
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/Buttons";
import Main from "@/layout/main";
import { useAuth } from "@/providers/AuthContext";
import { useDepartments } from "@/hooks/department/useDepartment";
import { useQuery } from "@apollo/client";
import { LOAD_DEPARTMENTS } from "@/hooks/department/queries";
import { useModal } from "@/providers/ModalProvider";
import { ModalId } from "@/providers/ModalWrapper";

interface Department {
  id: string;
  name: string;
  subdepartments: number;
}

const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const {} = useDepartments();
  const { showModal } = useModal();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    loading: loadLoading,
    error: loadError,
    data,
    refetch,
  } = useQuery(LOAD_DEPARTMENTS, {
    variables: { pagination: { page, limit } },
  });
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Engineering", subdepartments: 3 },
    { id: "2", name: "Marketing", subdepartments: 2 },
    { id: "3", name: "Sales", subdepartments: 4 },
    { id: "4", name: "Human Resources", subdepartments: 2 },
  ]);

  const handleEdit = (id: string) => {
    console.log("Edit department:", id);
  };

  const handleDelete = (id: string) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  const handleAdd = () => {
    showModal(ModalId.ADD_DEPARMENT, { refetch });
  };

  console.log(data?.loadDepartments?.data?.departments);

  return (
    <Main>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Departments
            </h1>
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <Plus size={18} />
              Add Department
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="px-3 py-4 sm:px-6  text-xs sm:text-sm font-medium text-gray-500 text-left"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 sm:px-6  text-xs sm:text-sm font-medium text-gray-500 text-left"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 sm:px-6  text-xs sm:text-sm font-medium text-gray-500 text-left"
                  >
                    Sub departments
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-4 sm:px-6 text-right text-xs sm:text-sm font-medium text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.loadDepartments?.data?.departments?.map(
                  (department: any) => (
                    <tr
                      key={department.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-3 py-4 sm:px-6 text-xs sm:text-sm text-gray-900 ">
                        {department.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 sm:px-6 text-xs sm:text-sm text-gray-900 ">
                        {department.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 sm:px-6 text-xs sm:text-sm text-gray-900 ">
                        {department.subDepartments.length}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 sm:px-6 text-right">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                          <Button
                            onClick={() => {
                              showModal(ModalId.VIEW_DEPARTMENT, {
                                department,
                                refetch,
                              });
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-xs sm:text-sm"
                          >
                            <Eye
                              size={16}
                              className="inline-flex mr-1 items center"
                            />
                            View
                          </Button>
                          <Button
                            onClick={() => handleDelete(department.id)}
                            variant="ghost"
                            size="sm"
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2
                              size={16}
                              className="inline-flex mr-1 items center"
                            />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default DashboardPage;
