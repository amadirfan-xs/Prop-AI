
import PropertyCard from '@/components/properties/PropertyCard';
import { Property } from '@/types';

interface PropertyGridProps {
    properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
            {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>
    );
}
