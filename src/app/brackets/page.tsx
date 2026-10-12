import { BracketView } from "@/components/BracketView";
import { Trophy } from "lucide-react";

export default function BracketsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-school-orange/15">
          <Trophy className="h-6 w-6 text-school-orange" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-school-navy sm:text-2xl">
            Κλήρωση & Brackets
          </h2>
          <p className="text-sm text-slate-600">
            Προημιτελικοί → Ημιτελικοί → Τελικός
          </p>
        </div>
      </div>
      <BracketView />
    </div>
  );
}
