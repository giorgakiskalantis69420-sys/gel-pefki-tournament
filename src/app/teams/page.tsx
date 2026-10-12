import { TeamsList } from "@/components/TeamsList";
import { Users } from "lucide-react";

export default function TeamsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-school-blue/15">
          <Users className="h-6 w-6 text-school-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-school-navy sm:text-2xl">
            Ομάδες & Ρόστερ
          </h2>
          <p className="text-sm text-slate-600">
            Όλες οι καταχωρημένες ομάδες για το ενεργό άθλημα
          </p>
        </div>
      </div>
      <TeamsList />
    </div>
  );
}
