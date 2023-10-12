import * as yup from "yup";

export const signinValidation = yup.object({
  email: yup.string().trim().email("Invalid email").required("Email is required."),
  password: yup.string().trim().required("Password is required."),
});

export const signupValidation = yup.object({
  name: yup.string().trim().required("Name is required."),
  email: yup.string().trim().email("Invalid email").required("Email is required."),
  password: yup.string().trim().required("Password is required."),
  repassword: yup
    .string()
    .trim()
    .required("Re-type password is required.")
    .oneOf([yup.ref("password")], "Password not matched."),
});

export const forgotPasswordValidation = yup.object({
  email: yup.string().trim().email("Invalid email").required("Email is required."),
});

export const resetPasswordValidation = yup.object({
  password: yup.string().trim().required("Password is required."),
  repassword: yup
    .string()
    .trim()
    .required("Re-type password is required.")
    .oneOf([yup.ref("password")], "Password not matched."),
});

export const updateBasicInfoValidation = yup.object({
  name: yup.string().trim().required("Name is required."),
  username: yup.string().trim().required("Username is required."),
  email: yup.string().trim().email("Invalid email").required("Email is required."),
});

export const updatePasswordValidation = yup.object({
  oldpassword: yup.string().trim().required("Old password is required."),
  newpassword: yup.string().trim().required("New password is required."),
  repassword: yup
    .string()
    .trim()
    .required("Re-type password is required.")
    .oneOf([yup.ref("newpassword")], "Password not matched."),
});
