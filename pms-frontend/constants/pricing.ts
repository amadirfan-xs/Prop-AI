export const PRICING_PLANS = [
    {
        planName: "Free Plan",
        price: "$0",
        features: [
            "Up to 5 properties per month",
            "Access to all social media platforms",
            "1 Buyer invitation per property",
            "1 Seller invitation per property",
            "Add-on features available"
        ],
        buttonText: "Get Started",
    },
    {
        planName: "Premium Plan",
        price: "$49",
        priceSuffix: "/mo (Base)",
        description: "Includes 50 properties per month",
        features: [
            "Up to 50 properties per month",
            "Additional properties at $1/property",
            "Listing Portal with auto-generated public pages",
            "Up to 5 Buyer invitations per property",
            "Up to 5 Seller invitations per property"
        ],
        buttonText: "Upgrade Now",
        isPremium: true
    },
    {
        planName: "Organizational Plan",
        price: "Custom",
        description: "Contact Us",
        features: [
            { text: "Brokerage registration support", icon: "business" },
            { text: "Multi-agent management capabilities", icon: "group" },
            { text: "Personalized branding & logo customization", icon: "branding_watermark" },
            { text: "Listing Portal with auto-generated public pages", icon: "grid_view" },
            { text: "Add-on: Custom template design ($100/mo)", icon: "add_circle" }
        ],
        buttonText: "Contact Sales",
        isOrganizational: true,
    }
];

export const ORG_UPGRADE_BADGES = [
    { icon: 'verified_user', text: 'SECURE CLOUD' },
    { icon: 'new_releases', text: 'ENTERPRISE READY' },
    { icon: 'support_agent', text: '24/7 SUPPORT' }
];
