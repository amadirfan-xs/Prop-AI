import {
    GridIcon,
    BuildingIcon,
    UsersIcon,
    ClipboardIcon,
    SettingsIcon,
    HelpIcon,
    LogoutIcon,
    PriceIcon,
    MailIcon,
    QRCodeIcon,
} from '@/constants/icons/DashboardIcons';

interface RouteInterface {
    name: string;
    icon: any;
    href: string;
    viewOnlyFor: number[];
};
const MAIN_NAV_ITEMS: RouteInterface[] = [
    { name: 'Dashboard', icon: GridIcon, href: '/', viewOnlyFor: [1, 2, 3, 5] },
    { name: 'Properties', icon: BuildingIcon, href: '/properties', viewOnlyFor: [1, 2, 3, 5] },
    { name: 'Inquiries', icon: MailIcon, href: '/inquiries', viewOnlyFor: [1, 5] },
    { name: 'Settings', icon: SettingsIcon, href: '/settings', viewOnlyFor: [1, 2, 3, 5] },
    { name: 'QR Codes', icon: QRCodeIcon, href: '/qr-codes' ,viewOnlyFor:[1, 5]},
    { name: 'Campaigns', icon: MailIcon, href: '/campaigns' ,viewOnlyFor:[1, 5]},
];

export const DASHBOARD_NAV_ITEMS: RouteInterface[] = [
    ...MAIN_NAV_ITEMS.filter(v=>v.viewOnlyFor?.includes(1))

]
export const SELLER_NAV_ITEMS: RouteInterface[] = [
    ...MAIN_NAV_ITEMS.filter(v=>v.viewOnlyFor?.includes(2))
];

export const BUYER_NAV_ITEMS: RouteInterface[] = [
    ...MAIN_NAV_ITEMS.filter(v=>v.viewOnlyFor?.includes(3))
];


export const DASHBOARD_BOTTOM_NAV_ITEMS = [
    { name: 'Pricing', icon: PriceIcon, href: '/pricing',viewOnlyFor:[1] }, // Org agents cannot access pricing
    // { name: 'Help Center', icon: HelpIcon, href: '/',viewOnlyFor:[1, 5] },
    { name: 'Logout', icon: LogoutIcon, href: '/auth/logout',viewOnlyFor:[1,2,3, 5] },
];

export const NAV_ITEMS = [
    { name: 'Dashboard', icon: GridIcon, href: '/org/dashboard' },
    { name: 'Agents', icon: UsersIcon, href: '/org/agents' },
    { name: 'Properties', icon: BuildingIcon, href: '/org/properties' },
    { name: 'Stakeholders', icon: ClipboardIcon, href: '/org/stakeholders' },
    { name: 'Settings', icon: SettingsIcon, href: '/org/settings' },
];

export const NAV_ITEMS_BY_ROLE: Record<number, any[]> = {
    1: DASHBOARD_NAV_ITEMS,
    2: SELLER_NAV_ITEMS,
    3: BUYER_NAV_ITEMS,
    4: NAV_ITEMS,
    5: DASHBOARD_NAV_ITEMS,
};

export const BOTTOM_NAV_ITEMS = [
    // { name: 'Help Center', icon: HelpIcon, href: '/',viewOnlyFor:[1,2,4] },
    { name: 'Logout', icon: LogoutIcon, href: '/auth/logout',viewOnlyFor:[4] },
];

export const PORTAL_NAV_LINKS = [
    { id: 'hero', label: 'Home', },
    { id: 'gallery', label: 'Gallery' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'contact', label: 'Contact Us' }
];
