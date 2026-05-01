export const ORG_SETTINGS_TABS = ['Personal Profile', 'Brokerage Details', 'Security'] as const;

export type OrgSettingsTab = typeof ORG_SETTINGS_TABS[number];

export const getOrgSettingsHeader = (activeTab: string) => {
    switch (activeTab) {
        case 'Personal Profile':
            return {
                title: 'Personal Profile',
                subtitle: 'Manage your individual account details and preferences.'
            };
        case 'Brokerage Details':
            return {
                title: 'Brokerage Profile',
                subtitle: "Manage your organization's public identity and branding."
            };
        case 'Security':
            return {
                title: 'Security Settings',
                subtitle: 'Update your password and secure your account.'
            };
        default:
            return {
                title: 'Settings',
                subtitle: 'Manage your account and organization.'
            };
    }
};
