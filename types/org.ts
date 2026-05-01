export interface Organization {
    id: number;
    name: string;
    taxId?: string | null;
    headquarters?: string | null;
    primaryColor?: string | null;
    privacyPolicy?: string | null;
    companyDescription?: string | null;
    plan: string;
    createdAt: string;
    updatedAt: string;
}

export interface AgentInvitationFormValues {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    office: string;
    isAdmin: boolean;
}
