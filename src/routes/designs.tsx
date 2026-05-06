import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ImagePlus } from "lucide-react";
import { designs } from "@/lib/mock-data";

export const Route = createFileRoute("/designs")({ component: Designs });

function Designs() {
  return (
    <>
      <PageHeader
        title="Designs"
        description="Reusable garment customization templates and reference imagery."
        actions={<Button><Plus className="mr-1.5 h-4 w-4" />New Design</Button>}
      />
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {designs.map((d) => (
          <Card key={d.id} className="overflow-hidden">
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-accent to-muted">
              <ImagePlus className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{d.name}</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{d.garment}</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <dt className="text-muted-foreground">Collar</dt><dd>{d.collar}</dd>
                <dt className="text-muted-foreground">Sleeve</dt><dd>{d.sleeve}</dd>
                <dt className="text-muted-foreground">Pocket</dt><dd>{d.pocket}</dd>
                <dt className="text-muted-foreground">Fit</dt><dd>{d.fit}</dd>
                <dt className="text-muted-foreground">Neck</dt><dd>{d.neck}</dd>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
