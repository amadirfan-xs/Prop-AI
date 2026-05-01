export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  tempPassword?: string | null;
  invitedBy?: number | null;
  userTypeId: number;
  organizationId?: number | null;
  status?: string;
  verified?: boolean;
  phoneNumber?: string | null;
};

export type UpdateResetPinInput = {
  userId: number;
  resetPIN: string | null;
  resetPINExpirationAt: Date | null;
  resendPasswordLimit?: number;
};

export type UpdatePasswordInput = {
  userId: number;
  passwordHash: string;
};
