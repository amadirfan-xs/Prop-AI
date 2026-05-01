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
      return { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    case 'pending':
    case 'scheduled':
      return { dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
    case 'failed':
      return { dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' };
    default:
      return { dot: 'bg-gray-300', text: 'text-gray-400', bg: 'bg-gray-50' };
  }
};

export const getActivityStyles = (event: string) => {
  switch (event) {
    case "Property Created":
      return { icon: "add_home", bg: "bg-indigo-50", color: "text-indigo-600" };
    case "Stakeholder Invited":
      return { icon: "person_add", bg: "bg-amber-50", color: "text-amber-600" };
    case "Media Uploaded":
      return {
        icon: "photo_camera",
        bg: "bg-emerald-50",
        color: "text-emerald-600",
      };
    case "Contract Uploaded":
      return {
        icon: "description",
        bg: "bg-indigo-50",
        color: "text-indigo-600",
      };
    case "Invite Resent":
      return {
        icon: "forward_to_inbox",
        bg: "bg-amber-50",
        color: "text-amber-600",
      };
    case "Social Post Created":
      return { icon: "share", bg: "bg-indigo-50", color: "text-indigo-600" };
    default:
      return { icon: "history", bg: "bg-gray-50", color: "text-gray-600" };
  }
};

export const getContractStatusStyles = (status: string) => {
  const normalized = (status || "PENDING").replace("_", " ");
  switch (normalized) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "REJECTED":
      return "bg-rose-50 text-rose-600 border-rose-100";
    case "REQUESTED CHANGES":
      return "bg-amber-50 text-amber-600 border-amber-100";
    default:
      return "bg-indigo-50 text-indigo-600 border-indigo-100";
  }
};
