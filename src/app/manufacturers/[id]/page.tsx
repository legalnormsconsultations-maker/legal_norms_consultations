import { notFound } from "next/navigation";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";
import { H1, H2, Paragraph } from "@/components/ui/typography";
import { CatalogService } from "@/services/catalog.service";

export default async function ManufacturerDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const manufacturer = await CatalogService.getManufacturerDetail(params.id);

  if (!manufacturer) return notFound();

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <H1>{manufacturer.name}</H1>
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <span>📍 {manufacturer.headquarters || "Unknown HQ"}</span>
          <span>🌍 {manufacturer.country || "Unknown Country"}</span>
        </div>
        {manufacturer.companyProfile && (
          <Paragraph className="mt-4 text-muted-foreground">
            {manufacturer.companyProfile}
          </Paragraph>
        )}
      </div>

      <div className="space-y-4">
        <H2>Associated Drugs</H2>
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <ResponsiveDataList
            data={manufacturer.drugs}
            keyExtractor={(d) => d.id}
            columns={[
              {
                header: "Drug Name",
                cell: (d) => (
                  <div className="font-medium text-foreground">
                    {d.drugName}
                  </div>
                ),
              },
              {
                header: "Status",
                cell: (d) => (
                  <div className="text-muted-foreground">{d.status}</div>
                ),
              },
            ]}
            emptyTitle="No drugs found"
            emptyDescription="This manufacturer has no associated drugs."
          />
        </div>
      </div>
    </div>
  );
}
