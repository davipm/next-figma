import { Label } from "@/components/ui/label";

type Props = {
  inputRef: any;
  attribute: string;
  placeholder: string;
  attributeType: string;
  handleInputChange: (property: string, value: string) => void;
};

export function Color({ placeholder, inputRef, attribute }: Props) {
  return (
    <div className="flex flex-col gap-3 border-b border-primary-grey-200 p-5">
      <h3 className="text-[10px] uppercase">{placeholder}</h3>
      <div
        className="flex items-center gap-2 border border-primary-grey-200"
        onClick={() => inputRef.current.click()}
      >
        <input type="text" />
        <label className="flex-1">{attribute}</label>
        <label className="">90%</label>
      </div>
    </div>
  );
}
