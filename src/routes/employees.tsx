import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { employees } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/employees")({ component: Employees });

function Employees() {
  return (
    <>
      <PageHeader title="Employees" description="Team roster, assignments, and performance." actions={<Button><Plus className="mr-1.5 h-4 w-4" />Add Employee</Button>} />
      <div className="p-6">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead>
              <TableHead>Contact</TableHead><TableHead className="text-right">Assigned</TableHead><TableHead>Performance</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {employees.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback className="bg-accent text-xs">{e.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                      <span className="font-medium">{e.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{e.role}</TableCell>
                  <TableCell className="text-muted-foreground">{e.contact}</TableCell>
                  <TableCell className="text-right">{e.assigned}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={e.performance} className="w-32" />
                      <span className="text-xs text-muted-foreground">{e.performance}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
