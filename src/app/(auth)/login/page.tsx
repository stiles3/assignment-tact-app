"use client";
import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Input } from "@/components/Inputs/TextInput";
import { PasswordInput } from "@/components/Inputs/PasswordInput";
import { Button } from "@/components/Buttons";
import { useLogin } from "@/hooks/auth/useLogin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";

interface FormState {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuth();
  const { login, loading, error } = useLogin();
  const [formState, setFormState] = useState<FormState>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formState.password) {
      newErrors.password = "Password is required";
    } else if (formState.password.length < 4) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Simulate API call
    try {
      await login(formState.username, formState.password);

      router.push("/");
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <LogIn className="h-12 w-12 mx-auto text-blue-500 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md"
        >
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-fade-in">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Input
                label="Username"
                id="username"
                name="username"
                type="text"
                value={formState.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <PasswordInput
                label="Password"
                id="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" size={"full"} loading={loading}>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
