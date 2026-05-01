import { Property } from '@/types';

export const INITIAL_PROPERTIES: any[] = [
    {
        id: 1,
        name: 'The Azure Residence',
        address: '422 West Marina Bay, FL',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
        status: 'Active',
        fulfillmentStatus: 'Verified',
        price: '$1,250,000',
        hasBedBadge: true,
        hasSizeBadge: true
    },
    {
        id: 2,
        name: 'Oak Ridge Estate',
        address: '891 Oak Lane, Austin TX',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
        status: 'Pending',
        fulfillmentStatus: 'In Review',
        price: '$845,000',
        hasBedBadge: true
    },
    {
        id: 3,
        name: 'Blue Wave Malibu',
        address: '12 Ocean Drive, Malibu CA',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
        status: 'Active',
        fulfillmentStatus: 'Verified',
        price: '$3,400,000',
        hasSizeBadge: true
    },
    {
        id: 4,
        name: 'Alpine View Lodge',
        address: '77 Summit Way, Aspen CO',
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop',
        status: 'Archived',
        fulfillmentStatus: 'Closed',
        price: '$620,000',
        isOffMarket: true
    },
    {
        id: 5,
        name: 'The Geometric Villa',
        address: '303 Modern Ave, Seattle WA',
        image: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800&auto=format&fit=crop',
        status: 'Active',
        fulfillmentStatus: 'Verified',
        price: '$1,850,000',
        hasBedBadge: true,
        hasSizeBadge: true
    },
    {
        id: 6,
        name: 'Ivy Rose Cottage',
        address: '45 Garden Rd, Portland OR',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
        status: 'Active',
        fulfillmentStatus: 'Verified',
        price: '$920,000',
        hasBedBadge: true
    }
];

export const PORTAL_PROPERTY_STATS = [
    { label: 'Bedrooms', value: '5 Beds', icon: 'bed' },
    { label: 'Bathrooms', value: '6 Baths', icon: 'bathtub' },
    { label: 'Living Area', value: '6,420 sqft', icon: 'square_foot' },
    { label: 'Lot Size', value: '0.85 Acres', icon: 'landscape' }
];

export const MARKETING_TASKS = [
    {
        id: '1',
        title: 'Virtual Tour Feature',
        date: 'Oct 24, 09:00 AM',
        status: 'Scheduled',
        statusColor: 'bg-emerald-500',
        textColor: 'text-emerald-600',
        icon: 'videocam',
        iconBg: 'bg-indigo-50 text-indigo-600'
    },
    {
        id: '2',
        title: 'Interior Highlight Reels',
        date: 'Oct 25, 04:30 PM',
        status: 'Draft',
        statusColor: 'bg-gray-300',
        textColor: 'text-gray-400',
        icon: 'flare',
        iconBg: 'bg-rose-50 text-rose-500'
    }
];

export const PARTICIPANTS = [
    {
        id: '1',
        name: 'Marcus Thorne',
        role: 'Primary Buyer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        email: 'm.thorne@globaltech.com',
        phone: '+1 (555) 234-8890',
        status: 'VERIFIED',
        statusColor: 'bg-[#F0FDF4] text-[#22C55E]'
    },
    {
        id: '2',
        name: 'Elena Vance',
        role: 'Property Owner',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        email: 'elena.vance@studio.net',
        phone: '+1 (555) 882-1200',
        status: 'PENDING SIGNATURE',
        statusColor: 'bg-[#FFFBEB] text-[#F59E0B]'
    }
];

export const ACTIVITIES = [
    {
        id: '1',
        title: 'Contract Revised by Marcus Thorne',
        time: '2 hours ago',
        icon: 'terminal',
        iconBg: 'bg-[#EEF2FF]',
        iconColor: 'text-[#3525CD]'
    },
    {
        id: '2',
        title: 'New Photos Uploaded to gallery',
        time: '5 hours ago',
        icon: 'photo_camera',
        iconBg: 'bg-[#F0FDF4]',
        iconColor: 'text-[#22C55E]'
    },
    {
        id: '3',
        title: 'Email Sent to Elena Vance',
        time: 'Yesterday at 3:12 PM',
        icon: 'mail',
        iconBg: 'bg-[#FFFBEB]',
        iconColor: 'text-[#F59E0B]'
    }
];

export const SOCIAL_MEDIA_PLATFORMS = [
    { id: 'facebook', name: 'Facebook', handle: 'Estate Ledger Page', icon: 'facebook', isSelected: true, scheduleDate: '2023-10-24', scheduleTime: '10:30' },
    { id: 'instagram', name: 'Instagram', handle: '@estate_ledger_pro', icon: 'photo_camera', isSelected: false, scheduleDate: '2023-10-24', scheduleTime: '10:30' },
    { id: 'linkedin', name: 'LinkedIn', handle: 'Estate Ledger Profile', icon: 'business', isSelected: false, scheduleDate: '2023-10-24', scheduleTime: '10:30' },
    { id: 'tiktok', name: 'TikTok', handle: '@estate_ledger_tok', icon: 'video_library', isSelected: false, scheduleDate: '2023-10-24', scheduleTime: '10:30' }
];

export const PAGINATION_MOCK_DATA = {
    pages: [2, 3],
    total: 12
};
