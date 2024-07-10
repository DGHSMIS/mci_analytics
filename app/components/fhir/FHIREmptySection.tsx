import { memo } from "react";

interface FHIREmptySectionProps {
    textToDisplay?: string
}
const FHIREmptySection = memo(function FHIREmptySection({textToDisplay = "No Items to display"}:FHIREmptySectionProps) {
    return (
      <div className="flex flex-col space-y-20">
        <p>{textToDisplay}</p>
      </div>
    );
  });


  export default FHIREmptySection;