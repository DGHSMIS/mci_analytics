"use client";

import Avatar from "@library/Avatar";
import FormItemResponseProps from "@library/form/FormItemResponseProps";
import TextField from "@library/form/TextField";
import _ from "lodash";
import React, { memo, useRef, useState } from "react";

/**
 * * Expected Interface of the Data to be passed to the component
 */
export interface TypeaheadSearchProps {
  hasClearButton?: boolean;
  apiURL: string;
  apiCallCharacterCount?: number;
  noResultsText?: string;
  debounceTime?: number;
  onClick: (e: FormItemResponseProps) => void;
}
/**
 * * Expected Interface of the API Response
 */
export interface TypeaheadAPIProps {
  id: number;
  value: string;
  image?: string;
  [key: string]: any;
}

/**
 * TypeaheadSearch Component
 *
 * @description
 * Company - ARITS Ltd. 22nd Jan 2023.
 * This component is used to render a typeahead search component with a debounced input
 *
 * @param {string} apiURL - The URL to call the API
 * @param {number} apiCallCharacterCount - The number of characters to be typed before the API call is made
 * @param {string} noResultsText - The text to be displayed when no results are found
 * @param {number} debounceTime - The time to wait before making the API call after the user stops typing
 * @param {function} onClick - The function to be called when the user clicks on a results, it returns the result of the clicked item using the FormItemResponseProps
 * => !!!!!Requires Implementation of API Call!!!!!
 */

const TypeaheadSearch = memo(function TypeaheadSearch({
  apiURL,
  apiCallCharacterCount = 2,
  noResultsText = "No Results Found",
  debounceTime = 500,
  hasClearButton = true,
  onClick,
}: TypeaheadSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [apiData, setApiData] = useState<TypeaheadAPIProps[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const ref = useRef(null);

  /**
   * * On typing on the search field, this function is called and updates the input value
   */
  const handleInputChange = (event: FormItemResponseProps) => {
    console.log("Input Updated");
    console.log(event.data);
    setInputValue(event.data?.toString() || "");
    debouncedHandleInputChange(event.data?.toString() || "");
  };

  /**
   * * Debounce the input change function with a delay of debounceTime
   * * This function is called when the user stops typing
   */
  const debouncedHandleInputChange = _.debounce((searchText: string) => {
    const promiseData = makeApiCall(searchText.trim());
    promiseData.then((data) => {
      setApiData(data || []);
      console.log(apiData);
    });
  }, debounceTime);

  /**
   * * Function to make the API call and return the data in the required format
   * ! Requires Implementation of API Call
   */
  const makeApiCall = async (data: string) => {
    console.log(`Should Make API CALL?`);
    console.log(data);
    if (data.length >= apiCallCharacterCount) {
      // Make API call here
      console.log("Trim data:");
      console.log(data.charCodeAt(4) == 32 ? "true" : "false");
      console.log(`Making API call with input value: ${data}`);
      // console.log(`trim data: ${data.trim}`);
      setHasResults(true);

      //   const response = fetch(apiURL, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       authorization: 'Bearer ' + localStorage.getItem('token'),
      //     },
      //     body: JSON.stringify({ search: data }),
      //   });
      return Promise.resolve<TypeaheadAPIProps[]>([
        {
          id: 1,
          value: "Test 1",
          description: "This is a discription",
          image:
            "https://www.aritsltd.com/blog/wp-content/uploads/2021/07/Elasticsearch-1-240x300.png",
        },
        {
          id: 2,
          value: "Test 2",
          description: "This is a discription 2",
          image:
            "https://www.aritsltd.com/blog/wp-content/uploads/2021/07/Elasticsearch-1-240x300.png",
        },
        {
          id: 3,
          value: "Test 3",
          description: "This is a discription 3",
          //   image: 'https://www.aritsltd.com/blog/wp-content/uploads/2021/07/Elasticsearch-1-240x300.png',
        },
        {
          id: 4,
          value: "Test 4",
          //   description: 'This is a discription 3',
          //   image: 'https://www.aritsltd.com/blog/wp-content/uploads/2021/07/Elasticsearch-1-240x300.png',
        },
      ]);
    } else {
      setHasResults(false);
      return Promise.resolve<TypeaheadAPIProps[]>([]);
    }
  };

  return (
    <div className="altd-typeahead-search relative transition" ref={ref}>
      <TextField
        placeholder="Search"
        fieldHeight="sm"
        leftIconName="search-md"
        label={""}
        value={inputValue}
        onChange={handleInputChange}
        {...(hasClearButton && inputValue != ""
          ? {
              rightIconName: "x-close",
              isRightIconClickable: true,
              onRightIconClick() {
                setInputValue("");
              },
            }
          : "")}
        // {...(hasClearButton
        //   ? {
        //       rightIconName: 'x-close',
        //       isRightIconClickable: true,
        //       onRightIconClick() {

        //         setInputValue('');
        //       },
        //     }
        //   : '')}
      />
      {apiData.length > 0 && inputValue != "" ? (
        <UnorderedList>
          {apiData.map((item, i) => (
            <li
              key={i}
              onClick={() => {
                console.log(`key value: ${i}`);
                setApiData([]);
                setHasResults(false);
                onClick({
                  data: item,
                  status: 200,
                });
              }}
              className="flex border-b-2 border-slate-100 py-4 transition hover:cursor-pointer hover:bg-slate-100"
            >
              <a
                href="#"
                className="flex items-center rounded pl-4 hover:cursor-pointer"
              >
                {item.image && (
                  <Avatar src={item.image} size="xs" shape="square" />
                )}
                <div className={`${item.image && "ml-6"}`}>
                  <div className="font-medium">{item.value}</div>
                  {item.description && (
                    <div className="text-xs">{item.description}</div>
                  )}
                </div>
              </a>
            </li>
          ))}
        </UnorderedList>
      ) : hasResults && inputValue != "" ? (
        <UnorderedList>
          <li className="flex py-4 transition hover:cursor-pointer hover:bg-slate-100">
            <div className="flex items-center rounded pl-4 hover:cursor-pointer">
              <div className="font-medium">{noResultsText}</div>
            </div>
          </li>
        </UnorderedList>
      ) : null}
    </div>
  );
});

const UnorderedList = memo(function UnorderedList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ul
      className="my-8 block h-fit w-full border bg-white px-8 py-8 text-base text-slate-700 dark:text-slate-200"
      aria-labelledby="dropdownSearchButton"
    >
      {children}
    </ul>
  );
});

export default TypeaheadSearch;
