import { memo } from "react";
import { ReactSVG } from "react-svg";

export interface SVGImageProps {
  svgPath: string;
  className?: string;
}

/**
 * SVGImage Component
 *
 * @description
 * - Company - ARITS Ltd. 19th Jan 2023.
 * ! This component is used to render SVG Images
 * @param {string} svgPath — Path of the SVG Image
 * @param {string} className — Custom class to be added to the SVG Image
 *
 */

const SvgImage = memo(function SvgImage({
  svgPath,
  className = "",
}: SVGImageProps) {
  return (
    <ReactSVG
      className={className}
      wrapper="span"
      src={svgPath}
      useRequestCache={true}
    />
  );
});

export default SvgImage;
