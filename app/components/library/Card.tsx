"use client";

import Button from "@components/library/Button";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { cn } from "tailwind-cn";

export interface CardProps {
  className?: string;
  linkURL?: string;
  hasImg?: boolean;
  imgSrc?: string;
  hasTitle?: boolean;
  title?: string;
  body?: string;
  hasButton?: boolean;
  buttonOnClick?: Function;
}

/**
 * @name Card
 * @description
 * * Company - ARITS Ltd. 4th Jan 2023.
 * This component is used to render a card.
 * The card can be used to display an image, title, body and a button.
 * The card can be used to link to another page.
 * @param {string} linkURL URL to be used when the card is clicked
 * @param {string} imgSrc URL of the image to be displayed
 * @param {string} title Text to be displayed as the title
 * @param {string} body Text to be displayed as the body
 * @param {Function} buttonOnClick When the card body button is clicked this function will triggred
 */

const Card = memo(function Card({
  className = "",
  hasButton = true,
  linkURL = "",
  hasImg = true,
  imgSrc = "/img/avatar.jpg",
  hasTitle = true,
  title = "Noteworthy technology acquisitions 2021",
  body = "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
  buttonOnClick,
}: CardProps) {
  const buttonClicked = () => buttonOnClick?.();

  return (
    <div
      className={cn(
        "atld-card max-w-sm rounded-lg bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      <Link href={linkURL}>
        {hasImg && (
          <div className="relative inline-flex h-[16rem] w-full overflow-hidden">
            <Image
              src={imgSrc}
              alt={title}
              title={title}
              className={`rounded-t-lg object-cover object-center`}
              fill={true}
              blurDataURL={`${process.env.blurDataURL}`}
              onClick={buttonClicked}
              placeholder="blur"
            />
          </div>
        )}
      </Link>
      <div className="space-y-16 p-16">
        <a href="#" onClick={buttonClicked}>
          {hasTitle && (
            <h5 className="text-2xl font-semibold leading-7 tracking-tight text-slate-900 transition hover:text-primary-600 dark:text-white">
              {title}
            </h5>
          )}
        </a>
        <p className="font-normal text-slate-600 dark:text-gray-400">{body}</p>
        {hasButton && (
          <Button
            clicked={buttonClicked}
            iconPos="right"
            iconName="arrow-right"
            btnText="Read more"
            size="md"
            type="submit"
          />
        )}
      </div>
    </div>
  );
});

export default Card;
