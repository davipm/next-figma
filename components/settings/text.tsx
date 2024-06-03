import {
  fontFamilyOptions,
  fontSizeOptions,
  fontWeightOptions,
} from "@/constants";

import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

const selectConfigs = [
  {
    property: "fontFamily",
    placeholder: "Choose a font",
    options: fontFamilyOptions,
  },
  { property: "fontSize", placeholder: "30", options: fontSizeOptions },
  {
    property: "fontWeight",
    placeholder: "SemiBold",
    options: fontWeightOptions,
  },
];

type TextProps = {
  fontFamily: "fontFamily";
  fontSize: string;
  fontWeight: string;
  handleInputChange: (property: string, value: string) => void;
};

export function Text({
  fontFamily,
  fontSize,
  fontWeight,
  handleInputChange,
}: TextProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-primary-grey-200 px-5 py-3">
      <h3 className="text-[10px] uppercase">Text</h3>
      <div className="flex flex-col gap-3">
        {RenderSelect({
          config: selectConfigs[0],
          fontSize,
          fontWeight,
          fontFamily,
          handleInputChange,
        })}

        <div className="flex gap-2">
          {selectConfigs.slice(1).map((config) =>
            RenderSelect({
              config,
              fontSize,
              fontWeight,
              fontFamily,
              handleInputChange,
            }),
          )}
        </div>
      </div>
    </div>
  );
}

type Props = {
  config: {
    property: string;
    placeholder: string;
    options: { label: string; value: string }[];
  };
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  handleInputChange: (property: string, value: string) => void;
};

const RenderSelect = ({
  config,
  fontSize,
  fontWeight,
  fontFamily,
  handleInputChange,
}: Props) => (
  <Select
    key={config.property}
    onValueChange={(value) => handleInputChange(config.property, value)}
    value={
      config.property === "fontFamily"
        ? fontFamily
        : config.property === "fontSize"
          ? fontSize
          : fontWeight
    }
  >
    <SelectTrigger className="no-ring w-full rounded-sm border border-primary-grey-200">
      <SelectValue />
    </SelectTrigger>
    <SelectTrigger className="border-primary-grey-200">
      <SelectValue />
    </SelectTrigger>
  </Select>
);
