"use client";

import FormItemResponseProps from "@library/form/FormItemResponseProps";
import { memo, useCallback, useState } from "react";
import { cn } from "tailwind-cn";

export interface RatingProps {
  rating?: number;
  totalStars?: number;
  starColor?: string;
  onRated?: (e: FormItemResponseProps) => void;
}

/**
 * @name Rating
 * @description
 * Company - ARITS Ltd. 5th Jan 2023.
 * This component is used to render a card.
 * @param {string} rating Number of starting rating value
 * @param {string} totalStars Number of total stars initiated
 * @param {string} starColor Color of the hover on stars
 * @param {string} onRated on click event fired when a star is clicked
 */

const Rating = memo(function Rating({
  rating = 1,
  onRated,
  totalStars = 3,
  starColor = "text-yellow-400",
}: RatingProps) {
  const [ratingVal, setRatingVal] = useState(rating);
  const [hasRated, setHasRated] = useState(false);
  const items: number[] = [];

  const handleClick = useCallback(
    (e: number) => {
      if (onRated) {
        const result: FormItemResponseProps = {
          data: e,
        };
        onRated(result);
      }

      setHasRated(true);
      return true;
    },
    [onRated]
  );

  for (let i = 0; i < totalStars; i++) {
    items.push(i);
  }

  return (
    <div>
      {items.map((index: any) => {
        return (
          ratingVal == index + 1 && (
            <div className="mb-8 flex items-center" key={index.toString()}>
              <StarItem
                totalStars={totalStars}
                starCount={hasRated ? index + 1 : 0}
                starColor={starColor}
                clicked={(e: any) => handleClick(e) && setRatingVal(e)}
              />
            </div>
          )
        );
      })}
    </div>
  );
});

//+ Rating star Component Starts
interface StarItemProps {
  starCount?: number;
  clicked?: any;
  starColor?: string;
  totalStars?: number;
}
const StarItem = memo(function StarItem({
  starCount = 1,
  clicked,
  totalStars = 5,
}: StarItemProps) {
  const hoverClass = "!text-yellow-400";
  const [hoverStar, setHoverStar] = useState(0);
  const hoverStarItem = useCallback((e: any) => {
    process.env.debugComponents == "true" && console.log(e);
    setHoverStar(e);
  }, []);

  const handleItemClick = useCallback(
    (e: any) => {
      process.env.debugComponents == "true" && console.log(e);
      if (clicked) {
        clicked(e);
      }
    },
    [clicked]
  );

  const items: number[] = [];
  for (let i = 0; i < totalStars; i++) {
    items.push(i);
  }

  return (
    <>
      {items.map((index) => (
        <SVGStar
          key={index.toString()}
          clicked={() => handleItemClick(index + 1)}
          hoverClassName={hoverStar > index ? hoverClass : ""}
          mouseEnter={(e: any) =>
            e ? hoverStarItem(index + 1) : setHoverStar(0)
          }
          showSelected={starCount > index ? true : false}
        />
      ))}

      <span className="ml-8 text-sm font-medium text-slate-500 dark:text-slate-300">
        {starCount} out of {totalStars}
      </span>
    </>
  );
});

interface SVGStarProps {
  clicked: (e: boolean) => void;
  mouseEnter: any;
  showSelected: boolean;
  hoverClassName?: string;
}

const SVGStar = memo(function SVGStar({
  clicked,
  mouseEnter,
  showSelected,
  hoverClassName,
}: SVGStarProps) {
  const handleClick = useCallback(
    (e: boolean) => {
      if (clicked) {
        clicked(e);
      }
    },
    [clicked]
  );

  return (
    <svg
      onClick={() => handleClick(true)}
      onMouseEnter={() => mouseEnter(true)}
      onMouseLeave={() => mouseEnter(false)}
      className={cn(
        "h-24 w-24 hover:cursor-pointer",
        showSelected ? "text-yellow-400" : "text-slate-300 dark:text-slate-500",
        hoverClassName
      )}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
});
export default Rating;
