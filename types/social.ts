export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'tiktok';

export type SocialPostMode = 'post_now' | 'schedule';

export interface CreateSocialPostTarget {
    platform: SocialPlatform;
    socialDestinationId?: number | null;
    scheduledFor?: string; // ISO timestamp
}

export interface CreateSocialPostPayload {
    caption: string;
    mode: SocialPostMode;
    targets: CreateSocialPostTarget[];
}

export interface SocialDestination {
    id: number;
    platform: SocialPlatform;
    destinationId: string;
    destinationName: string;
    isDefault: boolean;
}

export interface SocialPostResponse {
    postId: number;
    queuedTargets: number;
}

export interface PlatformUI {
    id: SocialPlatform;
    name: string;
    handle: string;
    icon: string;
    isSelected: boolean;
}

export interface ScheduleTargetUI {
    platform: SocialPlatform;
    socialDestinationId: number;
    scheduleDate: string;
    scheduleTime: string;
}

export interface SocialPostFormValues {
    platforms: PlatformUI[];
    content: string;
    strategy: 'now' | 'later';
    applyToAll: boolean;
    targets: ScheduleTargetUI[];
}
