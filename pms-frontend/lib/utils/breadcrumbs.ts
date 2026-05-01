import { BreadcrumbItem } from '@/components/common/Breadcrumbs';

export const getPropertyBreadcrumbs = (
    propertyId: string, 
    propertyTitle: string = 'Property', 
    subPage?: string,
    isOrg: boolean = false
): BreadcrumbItem[] => {
    const baseHref = isOrg ? '/org/properties' : '/properties';
    const items: BreadcrumbItem[] = [
        { label: 'Property', href: baseHref },
        { label: propertyTitle, href: `${baseHref}/${propertyId}` },
    ];

    if (subPage) {
        items.push({ label: subPage });
    }

    return items;
};

export const getContractsBreadcrumbs = (
    propertyId: string,
    propertyTitle: string = 'Property',
    isSelection: boolean = false
): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
        { label: 'Property', href: '/properties' },
        { label: propertyTitle, href: `/properties/${propertyId}` },
    ];

    if (isSelection) {
        items.push({ label: 'Contract Selection' });
    } else {
        items.push({ label: 'Contract Hub' });
    }

    return items;
};
