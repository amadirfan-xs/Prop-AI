export type PropertyStatus = 'Draft' | 'Pending' | 'Active' | 'Completed';

export interface Property {
    id: number;
    property_title: string;
    street_address: string;
    city?: string;
    zip_code?: string;
    property_media: Array<{ originalKey: string; signedUrl: string }>;
    status: PropertyStatus;
    fulfillment_status?: string;
    asking_price_monthly?: string;
    beds?: number;
    baths?: number;
    total_sqft?: number;
    property_type?: string;
    property_description?: string;
    listing_highlights?: string[];
    created_at?: string;
    updated_at?: string;
    stakeholders?: Stakeholder[];
    marketing_schedule?: Array<{
        id: number;
        platform: string;
        scheduled_for: string | null;
        created_at: string;
        status: string;
    }>;
    contract_status?: {
        source: string;
        created_at: string;
        current_version?: number;
    };
    recent_activities?: Array<{
        event: string;
        description: string;
        created_at: string;
        actor_name: string;
    }>;
    agent?: {
        name: string;
        email: string;
        phone_number?: string | null;
        calendly_url?: string | null;
    };
}

export interface ContractTemplate {
    id: number;
    name: string;
    type: string;
    description: string | null;
    html_content: string;
    created_at: string;
}

export interface ContractVersion {
    id: number;
    property_id: number;
    document_key: string;
    input_source: 'PDF' | 'HTML' | 'html' | 'pdf';
    is_latest: boolean;
    parent_id: number | null;
    html_content: string | null;
    status: string;
    consensusStats?: {
        totalSellers: number;
        approvedSellers: number;
        rejectedSellers: number;
        requestChangeSellers: number;
        totalBuyers: number;
        approvedBuyers: number;
        rejectedBuyers: number;
        requestChangeBuyers: number;
        totalRequired: number;
        totalApproved: number;
        hasVetoed: boolean;
    };
    decisions: Array<{
        id: number;
        user_id: number;
        userName: string;
        decision: string;
        comment: string | null;
        created_at: string;
    }>;
    created_at: string;
    signed_url?: string;
}

export interface Stakeholder {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        phone_number?: string;
        profile_image_url?: string;
    };
    userType: {
        id: number;
        name: string;
    };
    status?: string;
}

export interface PropertyCardProps {
    property: Property;
}

export interface PropertyQrScan {
    id: number;
    property_id: number;
    latitude: number | null;
    longitude: number | null;
    city: string | null;
    country: string | null;
    ip_address: string | null;
    scanned_at: string;
}

export interface PropertyQrStats {
    totalScans: number;
    latestScans: PropertyQrScan[];
}

export interface PropertyInquiry {
    id: number;
    property_id: number;
    first_name: string;
    last_name: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
    property_title: string;
}

export interface PropertyFormValues {
    title: string;
    description: string;
    type: string;
    price: string | number;
    beds: string | number;
    baths: string | number;
    sqft: string | number;
    address: string;
    city: string;
    zipCode: string;
    listingHighlights: string;
    files: File[];
}
