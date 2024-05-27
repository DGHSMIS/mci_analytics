"use client";

import Chip from "@components/library/Chip";
import Label from "@components/library/form/Label";
import { memo, useState } from "react";

export interface TagsInputProps {
  onClick?: (tags: string[]) => void;
  className?: string;
  placeHolder?: string;
  label?: string;
}

/**
 * TagInput Component
 *
 * @description
 * Company - ARITS Ltd. 15th Jan 2023.
 * This component is used to render an TagInput Element.
 * @param {Array<AccordionObject>} onClick Items for the accordion with the accordion data and configuration
 * @param {Function} className Sets the index of the clicked TagInput Element
 * @param {string} placeHolder Placeholder for the  Tag Input Component
 * @param {string} label label for the  Tag Input Text Field
 */

export const TagsInput = memo(function TagsInput({
  onClick,
  className,
  placeHolder = "Type Something",
  label = "",
}: TagsInputProps) {
  const [tags, setTags] = useState<string[]>([]);

  function handleKeyDown(e: any) {
    if (e.key !== "Enter") return;
    const value = e.target.value;

    if (tags.includes(value)) {
      return;
    }
    if (value) {
      setTags([...tags, value]);
      tags.push(value);
      if (onClick) {
        onClick(tags);
      }
      e.target.value = "";
    }
  }

  return (
    <>
      <div className={`max-w-min ${className}`}>
        {label.length > 0 && <Label text={label}></Label>}

        <input
          onKeyDown={handleKeyDown}
          type="text"
          className="ring-focus-0 rounded border-slate-400"
          placeholder={placeHolder}
        />

        <div className="mt-4 bg-slate-100 px-8 py-4 ">
          {tags.map((tag, index) => (
            <div className="inline-block p-4" key={index}>
              <Chip
                text={tag}
                className="bg-slate-300 text-white"
                clicked={() => {
                  setTags(tags.filter((x) => x !== tag));
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
});
