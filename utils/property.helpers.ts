
export const getFulfillmentColor = (status: string) => {
    switch (status) {
        case 'Approved':
        case 'Approved by Sellers':
        case 'Approved by Buyers':
            return 'bg-emerald-500';
        case 'Rejected':
        case 'Rejected by Sellers':
        case 'Rejected by Buyers':
            return 'bg-rose-500';
        case 'Waiting for Approval':
        case 'In Review':
            return 'bg-amber-500';
        case 'Draft PC':
            return 'bg-indigo-500';
        default:
            return 'bg-gray-300';
    }
};

export const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return 'public';
        case 'instagram': return 'photo_camera';
        case 'linkedin': return 'business';
        case 'tiktok': return 'video_library';
        default: return 'share';
    }
};

export const getMarketingStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
        case 'posted':
            return { dot: 'bg-emerald-500', text: 'text-emerald-600' };
        case 'pending':
        case 'scheduled':
            return { dot: 'bg-amber-500', text: 'text-amber-600' };
        case 'failed':
            return { dot: 'bg-red-500', text: 'text-red-600' };
        default:
            return { dot: 'bg-gray-300', text: 'text-gray-400' };
    }
};


export const getActivityStyles = (event: string) => {
    switch (event) {
        case 'Property Created':
            return { icon: 'add_home', bg: 'bg-indigo-50', color: 'text-indigo-600' };
        case 'Stakeholder Invited':
            return { icon: 'person_add', bg: 'bg-amber-50', color: 'text-amber-600' };
        case 'Media Uploaded':
            return { icon: 'photo_camera', bg: 'bg-emerald-50', color: 'text-emerald-600' };
        case 'Contract Uploaded':
            return { icon: 'description', bg: 'bg-indigo-50', color: 'text-indigo-600' };
        case 'Invite Resent':
            return { icon: 'forward_to_inbox', bg: 'bg-amber-50', color: 'text-amber-600' };
        case 'Social Post Created':
            return { icon: 'share', bg: 'bg-indigo-50', color: 'text-indigo-600' };
        default:
            return { icon: 'history', bg: 'bg-gray-50', color: 'text-gray-600' };
    }
};

export const getPropertyStatusStyles = (status: string) => {
    switch (status) {
        case 'Active':
            return 'bg-blue-50 text-blue-600 outline-blue-100 outline';
        case 'Pending':
            return 'bg-amber-50 text-amber-600 outline-amber-100 outline';
        default:
            return 'bg-slate-100 text-slate-500 outline-slate-200 outline';
    }
};
