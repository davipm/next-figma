import { exportToPdf } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Export() {
  return (
    <div className="flex flex-col gap-3 px-5 py-3">
      <h3 className="text-[10px] uppercase">Export</h3>
      <Button
        variant="outline"
        onClick={exportToPdf}
        className="w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black"
      >
        Export to PDF
      </Button>
    </div>
  );
}
