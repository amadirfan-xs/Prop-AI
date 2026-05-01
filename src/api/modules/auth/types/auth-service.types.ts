export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ForgetPasswordInput = {
  email: string;
};

export type VerifyPINInput = {
  email: string;
  resetPIN: string;
};

export type NewPasswordInput = {
  email: string;
  resetPIN: string;
  password: string;
};

export type ResendPINInput = {
  type: string;
  email: string;
};

export type ChangeTempPasswordInput = {
  newPassword: string;
};

export type ChangePasswordInput = {
  previousPassword: string;
  newPassword: string;
};
