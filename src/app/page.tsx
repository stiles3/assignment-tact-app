"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/Buttons";
import Main from "@/layout/main";
import { useAuth } from "@/providers/AuthContext";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_DEPARTMENT,
  LOAD_DEPARTMENTS,
} from "@/hooks/department/queries";
import { useModal } from "@/providers/ModalProvider";
import { ModalId } from "@/providers/ModalWrapper";
import { useRouter } from "next/navigation";

interface Department {
  id: string;
  name: string;
  subdepartments: number;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showModal } = useModal();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    loading: loadLoading,
    error: loadError,
    data,
    refetch,
    fetchMore,
  } = useQuery(LOAD_DEPARTMENTS, {
    variables: { pagination: { page, limit } },
  });

  const [deleteDepartment, { loading: deleteLoading }] =
    useMutation(DELETE_DEPARTMENT);

  const handleDelete = (id: string) => {
    showModal(ModalId.DELETE_CONFIRM, {
      title: "Delete Department",
      message: "Are you sure you want to delete this department?",
      onConfirm: async () => {
        if (id) {
          await deleteDepartment({
            variables: { deleteDepartmentInput: { id } },
          });
          refetch();
        }
      },
    });
  };

  const handleAdd = () => {
    showModal(ModalId.ADD_DEPARMENT, { refetch });
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    fetchMore({
      variables: {
        pagination: { page: nextPage, limit },
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        return {
          loadDepartments: {
            ...fetchMoreResult.loadDepartments,
            data: {
              ...fetchMoreResult.loadDepartments.data,
              departments: [
                ...prevResult.loadDepartments.data.departments,
                ...fetchMoreResult.loadDepartments.data.departments,
              ],
            },
          },
        };
      },
    }).then(() => {
      setPage(nextPage);
    });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      // For previous pages, we can just refetch since we likely have the data cached
      refetch({ pagination: { page: prevPage, limit } });
    }
  };

  const totalDepartments = data?.loadDepartments?.data?.total || 0;
  const totalPages = Math.ceil(totalDepartments / limit);

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

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(page * limit, totalDepartments)}
                </span>{" "}
                of <span className="font-medium">{totalDepartments}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setPage(pageNum);
                        refetch({ pagination: { page: pageNum, limit } });
                      }}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === pageNum
                          ? "bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default DashboardPage;
