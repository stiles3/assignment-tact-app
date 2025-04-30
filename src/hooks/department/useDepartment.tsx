import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  ADD_SUB_DEPARTMENT,
  UPDATE_SUB_DEPARTMENT,
  DELETE_SUB_DEPARTMENT,
  LOAD_DEPARTMENTS,
  DELETE_DEPARTMENT,
} from "./queries";

interface DepartmentHook {
  createDepartment: (
    input: CreateDepartmentInput
  ) => Promise<DepartmentResponse>;
  updateDepartment: (
    input: UpdateDepartmentInput
  ) => Promise<DepartmentResponse>;
  addSubDepartment: (
    input: CreateSubDepartmentInput
  ) => Promise<SubDepartmentResponse>;
  updateSubDepartment: (
    input: UpdateSubDepartmentInput
  ) => Promise<BaseResponse>;
  deleteSubDepartment: (input: DeleteDepartmentInput) => Promise<BaseResponse>;
  deleteDepartment: (
    input: DeleteDepartmentInput
  ) => Promise<DepartmentResponse>;

  loading: boolean;
  error?: Error;
}

interface CreateDepartmentInput {
  name: string;
  subDepartments?: {
    name: string;
  };
}

interface UpdateDepartmentInput {
  id: string;
  name: string;
}

interface CreateSubDepartmentInput {
  departmentId: string;
  name: string;
}

interface UpdateSubDepartmentInput {
  id: string;
  name: string;
}

interface DeleteDepartmentInput {
  id: string;
}

interface PaginationInput {
  limit?: number | null;
  page?: number | null;
}

interface BaseResponse {
  message: string;
  status: string;
}

interface DepartmentResponse extends BaseResponse {
  data?: {
    id: string;
    name: string;
    subDepartments?: {
      id: string;
      name: string;
    }[];
  };
}

interface SubDepartmentResponse extends BaseResponse {
  data?: {
    id: string;
    name: string;
  };
}

interface LoadDepartmentsResponse extends BaseResponse {
  data?: {
    departments: {
      id: string;
      name: string;
      subDepartments: {
        id: string;
        name: string;
      }[];
    }[];
  };
}

export const useDepartments = (): DepartmentHook => {
  // Create Department
  const [createDeptMutation, { loading: createLoading, error: createError }] =
    useMutation(CREATE_DEPARTMENT);

  // Update Department
  const [updateDeptMutation, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_DEPARTMENT);

  // Add Sub-Department
  const [addSubDeptMutation, { loading: addSubLoading, error: addSubError }] =
    useMutation(ADD_SUB_DEPARTMENT);

  // Update Sub-Department
  const [
    updateSubDeptMutation,
    { loading: updateSubLoading, error: updateSubError },
  ] = useMutation(UPDATE_SUB_DEPARTMENT);

  // Delete Sub-Department
  const [
    deleteSubDeptMutation,
    { loading: deleteSubLoading, error: deleteSubError },
  ] = useMutation(DELETE_SUB_DEPARTMENT);

  // Delete Department
  const [deleteDeptMutation, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_DEPARTMENT);

  // Load Departments

  const loading =
    createLoading ||
    updateLoading ||
    addSubLoading ||
    updateSubLoading ||
    deleteSubLoading ||
    deleteLoading;

  const error =
    createError ||
    updateError ||
    addSubError ||
    updateSubError ||
    deleteSubError ||
    deleteError;

  const createDepartment = async (input: CreateDepartmentInput) => {
    const { data } = await createDeptMutation({
      variables: { createDepartmentInput: input },
    });
    return data.createDepartment;
  };

  const updateDepartment = async (input: UpdateDepartmentInput) => {
    const { data } = await updateDeptMutation({
      variables: { updateDepartmentInput: input },
    });
    return data.updateDepartment;
  };

  const addSubDepartment = async (input: CreateSubDepartmentInput) => {
    const { data } = await addSubDeptMutation({
      variables: { createSubDepartmentInput: input },
    });
    return data.addSubDepartment;
  };

  const updateSubDepartment = async (input: UpdateSubDepartmentInput) => {
    const { data } = await updateSubDeptMutation({
      variables: { updateSubDepartmentInput: input },
    });
    return data.updateSubDepartment;
  };

  const deleteSubDepartment = async (input: DeleteDepartmentInput) => {
    const { data } = await deleteSubDeptMutation({
      variables: { deleteDepartmentInput: input },
    });
    return data.deleteSubDepartment;
  };

  const deleteDepartment = async (input: DeleteDepartmentInput) => {
    const { data } = await deleteDeptMutation({
      variables: { deleteDepartmentInput: input },
    });
    return data.deleteDepartment;
  };

  return {
    createDepartment,
    updateDepartment,
    addSubDepartment,
    updateSubDepartment,
    deleteSubDepartment,
    deleteDepartment,
    loading,
    error,
  };
};
