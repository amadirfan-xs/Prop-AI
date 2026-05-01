import PropertyDetailsContainer from "@/components/properties/details/PropertyDetailsContainer";

export default async function OrgPropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <PropertyDetailsContainer propertyId={id} />
    );
}
