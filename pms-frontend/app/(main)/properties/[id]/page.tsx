import PropertyDetailsContainer from "@/components/properties/details/PropertyDetailsContainer";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <PropertyDetailsContainer propertyId={id} />
    );
}
