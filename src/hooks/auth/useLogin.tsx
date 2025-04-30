import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";

const LOGIN_USER = gql`
  mutation LoginUser($loginUserInput: LoginUserInput!) {
    loginUser(loginUserInput: $loginUserInput) {
      status
      message
      data {
        id
        username
      }
    }
  }
`;

export function useLogin() {
  const [login, { data, loading, error }] = useMutation(LOGIN_USER);

  return {
    login: async (username: string, password: string) => {
      try {
        const response = await login({
          variables: {
            loginUserInput: {
              username,
              password,
            },
          },
        });
        return response.data.loginUser;
      } catch (err) {
        console.error("Login error:", err);
        throw err;
      }
    },
    data,
    loading,
    error,
  };
}
