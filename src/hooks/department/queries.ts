import { gql } from "@apollo/client";

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($createDepartmentInput: CreateDepartmentDto!) {
    createDepartment(createDepartmentInput: $createDepartmentInput) {
      data {
        id
        name
        subDepartments {
          id
          name
        }
      }
      message
      status
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($updateDepartmentInput: UpdateDepartmentDto!) {
    updateDepartment(updateDepartmentInput: $updateDepartmentInput) {
      data {
        id
        name
      }
      message
      status
    }
  }
`;

export const ADD_SUB_DEPARTMENT = gql`
  mutation AddSubDepartment(
    $createSubDepartmentInput: CreateSubDepartmentDto!
  ) {
    addSubDepartment(createSubDepartmentInput: $createSubDepartmentInput) {
      data {
        id
        name
      }
      message
      status
    }
  }
`;

export const UPDATE_SUB_DEPARTMENT = gql`
  mutation UpdateSubDepartment(
    $updateSubDepartmentInput: UpdateSubDepartmentDto!
  ) {
    updateSubDepartment(updateSubDepartmentInput: $updateSubDepartmentInput) {
      message
      status
    }
  }
`;

export const DELETE_SUB_DEPARTMENT = gql`
  mutation DeleteSubDepartment($deleteDepartmentInput: DeleteDepartmentDto!) {
    deleteSubDepartment(deleteDepartmentInput: $deleteDepartmentInput) {
      message
      status
    }
  }
`;

export const LOAD_DEPARTMENTS = gql`
  query LoadDepartments($pagination: PaginationDto!) {
    loadDepartments(pagination: $pagination) {
      data {
        departments {
          id
          name
          subDepartments {
            id
            name
          }
        }
        meta {
          total
          page
          limit
        }
      }
      message
      status
    }
  }
`;

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($deleteDepartmentInput: DeleteDepartmentDto!) {
    deleteDepartment(deleteDepartmentInput: $deleteDepartmentInput) {
      data {
        id
        name
        subDepartments {
          id
          name
        }
      }
      message
      status
    }
  }
`;

export interface CreateDepartmentDto {
  name: string;
  subDepartments?: {
    name: string;
  };
}

export interface UpdateDepartmentDto {
  id: string;
  name: string;
}

export interface CreateSubDepartmentDto {
  departmentId: string;
  name: string;
}

export interface UpdateSubDepartmentDto {
  id: string;
  name: string;
}

export interface DeleteDepartmentDto {
  id: string;
}

export interface PaginationDto {
  limit?: number | null;
  page?: number | null;
}
