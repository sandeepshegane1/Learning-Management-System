import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService, forgotPasswordService, resetPasswordService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState({
    ...initialSignInFormData,
    rememberMe: false
  });
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetPasswordStatus, setResetPasswordStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
    console.log(data, "datadatadatadatadata");
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginService(signInFormData);
    console.log(data, "datadatadatadatadata");

    if (data.success) {
      // Store token in localStorage if rememberMe is checked, otherwise in sessionStorage
      const storage = signInFormData.rememberMe ? localStorage : sessionStorage;

      storage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );

      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  //check auth user

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    // Clear both localStorage and sessionStorage
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");

    setAuth({
      authenticate: false,
      user: null,
    });
  }

  async function handleForgotPassword(email) {
    try {
      setResetPasswordStatus({ loading: true, success: false, error: null });
      const response = await forgotPasswordService(email);
      if (response.success) {
        setResetPasswordStatus({ loading: false, success: true, error: null });
        return true;
      } else {
        setResetPasswordStatus({ loading: false, success: false, error: response.message });
        return false;
      }
    } catch (error) {
      setResetPasswordStatus({ loading: false, success: false, error: error.message || "An error occurred" });
      return false;
    }
  }

  async function handleResetPassword(token, newPassword) {
    try {
      setResetPasswordStatus({ loading: true, success: false, error: null });
      const response = await resetPasswordService(token, newPassword);
      if (response.success) {
        setResetPasswordStatus({ loading: false, success: true, error: null });
        return true;
      } else {
        setResetPasswordStatus({ loading: false, success: false, error: response.message });
        return false;
      }
    } catch (error) {
      setResetPasswordStatus({ loading: false, success: false, error: error.message || "An error occurred" });
      return false;
    }
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
        checkAuthUser,
        forgotPasswordEmail,
        setForgotPasswordEmail,
        handleForgotPassword,
        handleResetPassword,
        resetPasswordStatus
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
