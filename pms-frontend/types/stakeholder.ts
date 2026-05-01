export interface InviteStakeholderFormValues {
    name: string;
    email: string;
    role: 'buyer' | 'seller';
}

export interface StakeholderInvitationPayload {
    name: string;
    email: string;
    userTypeId: number;
    userType: 'individual' | 'organization';
}
