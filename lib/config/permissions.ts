/**
 * Centralized Role Permission Configuration
 * 
 * Scalable system to manage what different user types can do in the application.
 */

export const USER_TYPES = {
    AGENT: 1,
    SELLER: 2,
    BUYER: 3,
    ORGANIZATION:4,
    ORG_AGENT:5,
};

export interface UserPermissions {
    canManageContracts: boolean;      
    canInviteStakeholders: boolean;  
    canDecideContracts: boolean;      
    canExportContract: boolean;      
    canCreateMarketings:boolean;
    canCreateProperty:boolean;
}

const DEFAULT_PERMISSIONS: UserPermissions = {
    canManageContracts: false,
    canInviteStakeholders: false,
    canDecideContracts: false,
    canExportContract: true,
    canCreateProperty:false,
    canCreateMarketings:true,
};

export const PERMISSIONS_MAP: Record<number, UserPermissions> = {
    [USER_TYPES.AGENT]: {
        ...DEFAULT_PERMISSIONS,
        canManageContracts: true,
        canCreateProperty:true,
        canInviteStakeholders: true,
    },
    [USER_TYPES.SELLER]: {
        ...DEFAULT_PERMISSIONS,
        canDecideContracts: true,
        canCreateMarketings:false,
    },
    [USER_TYPES.BUYER]: {
        ...DEFAULT_PERMISSIONS,
        canCreateMarketings:false,
        canDecideContracts: true,
    },
    [USER_TYPES.ORGANIZATION]: {
        ...DEFAULT_PERMISSIONS,
        canCreateMarketings:false,
        canDecideContracts: false,  
        canInviteStakeholders:false,
        canManageContracts:false,
        canExportContract:false,
    },
    [USER_TYPES.ORG_AGENT]: {
        ...DEFAULT_PERMISSIONS,
        canExportContract:true,
        canCreateProperty:true,
        canInviteStakeholders:true,
        canManageContracts:true,
        canCreateMarketings:true,
    },
};

export const getPermissions = (userTypeId?: number): UserPermissions => {
    if (!userTypeId) return DEFAULT_PERMISSIONS;
    return PERMISSIONS_MAP[userTypeId] || DEFAULT_PERMISSIONS;
};
