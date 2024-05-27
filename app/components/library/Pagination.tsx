import { memo, useEffect, useState } from "react";
import ButtonIcon from "./ButtonIcon";

export interface PaginationProps {
  className?: string;
  totalRows?: number;
  pageSize?: number;
  pageSkipLevel?: number;
  showPageNumbers?: number;
  isShowSkipPageButton?: boolean;
  isShowSkipFirstLastPageButton?: boolean;
  selectedPage: (e: number) => void;
}

/**
 * TextField Component
 *
 * @description
 * Company - ARITS Ltd. 1st Jan 2023.
 * This component is used for navigating page for pagination
 * Please note,  require('@tailwindcss/forms'), is required in the tailwind.config.js file.
 * for this component to work.
 * @param {string}   className Pass CSS Classes from Parent in Needed
 * @param {number}   totalRows Total number of rows of data
 * @param {number}   pageSize Number of data to show in each page
 * @param {number}   pageSkipLevel Number of pages to skip with one click
 * @param {number}   showPageNumbers Number of Pages to show at a time
 * @param {boolean}  isShowSkipPageButton Show skip page button
 * @param {boolean}  isShowSkipFirstLastPageButton Show Button to Skip to First or Last Page
 * @param {void}     selectedPage Function To return current page
 */

const Pagination = memo(function Pagination({
  className = "",
  totalRows = 104,
  pageSize = 10,
  pageSkipLevel = 5,
  showPageNumbers = 5,
  isShowSkipPageButton = false,
  isShowSkipFirstLastPageButton = false,
  selectedPage,
}: PaginationProps) {
  const [totalDataCount, setTotalDataCount] = useState(totalRows);
  const [pageDataCount, setPageDataCount] = useState(pageSize);
  const [pageNumbers, setPageNumbers] = useState<Array<number>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [pagesToShow, setPagesToShow] = useState(showPageNumbers);
  const [halfPagesToShow, setHalfPagesToShow] = useState<number>(0);

  useEffect(() => {
    setTotalDataCount(totalRows);
  }, [totalRows]);

  useEffect(() => {
    setPageDataCount(pageSize);
  }, [pageSize]);

  useEffect(() => {
    setPagesToShow(showPageNumbers);
  }, [showPageNumbers]);

  useEffect(() => {
    setHalfPagesToShow(Math.floor(pagesToShow / 2));
  }, [pagesToShow]);

  useEffect(() => {
    if (totalDataCount !== 0 && pageDataCount !== 0) {
      const numberOfPages = Math.ceil(totalDataCount / pageDataCount);
      setPageNumbers(Array.from({ length: numberOfPages }, (_, i) => i + 1));
    }
  }, [totalDataCount, pageDataCount]);

  useEffect(() => {
    // + My Code
    // if (pageNumbers.length > 0) {
    //   const newStartPage = Math.max(1, currentPage - halfPagesToShow)
    //   const newEndPage = Math.min(pageNumbers.length, newStartPage + pagesToShow - 1)

    //   setStartPage(newStartPage)
    //   setEndPage(newEndPage)
    //   selectedPage(currentPage)
    // }

    // + ChatGPT Code
    if (pageNumbers.length > 0) {
      let newStartPage;
      let newEndPage;

      if (currentPage <= halfPagesToShow + 1) {
        newStartPage = 1;
        newEndPage = pagesToShow;
      } else if (currentPage >= pageNumbers.length - halfPagesToShow) {
        newStartPage = pageNumbers.length - pagesToShow + 1;
        newEndPage = pageNumbers.length;
      } else {
        newStartPage = currentPage - halfPagesToShow;
        newEndPage = currentPage + halfPagesToShow;
      }

      setStartPage(newStartPage);
      setEndPage(newEndPage);
      selectedPage(currentPage);
    }
  }, [currentPage, pageNumbers]);

  // Debugging useEffects
  useEffect(() => {
    if (pageNumbers.length > 0) {
      console.log("Page Numbers Array:", pageNumbers);
    }
  }, [pageNumbers]);

  useEffect(() => {
    console.log("current page:", currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log("Start Page", startPage);
  }, [startPage]);

  useEffect(() => {
    console.log("End Page", endPage);
  }, [endPage]);

  return (
    <div
      className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 ${className}`}
    >
      <div className="flex flex-1 flex-col items-center space-y-12">
        <div>
          <p className="text-sm font-medium text-gray-700">
            {`Showing ${currentPage * pageSize - (pageSize - 1)} to ${
              currentPage * pageSize < totalDataCount
                ? currentPage * pageSize
                : totalDataCount
            } of ${totalDataCount} results`}
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex gap-x-4 -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {isShowSkipFirstLastPageButton && currentPage != 1 && (
              <span
                // + Go To First Page
                onClick={() => {
                  setCurrentPage(1);
                }}
              >
                First
              </span>
            )}
            {isShowSkipPageButton && (
              <ButtonIcon
                // + Go To Previous pageSkipLevel Page
                clicked={() => {
                  setCurrentPage(
                    currentPage - pageSkipLevel > 1
                      ? currentPage - pageSkipLevel
                      : 1
                  );
                }}
                isDisabled={currentPage === 1}
                iconName="arrow-block-left"
                title="Previous 5 page"
              />
            )}
            <ButtonIcon
              // + Go To Previous Page
              clicked={() => {
                setCurrentPage(currentPage - 1);
              }}
              isDisabled={currentPage === 1}
              iconName="arrow-left"
              title="Previous page"
            />
            <div className="mt-8 flex justify-center">
              <ul className="flex space-x-4">
                {pageNumbers.slice(startPage - 1, endPage).map((page) => (
                  <li
                    key={page}
                    className={`cursor-pointer rounded border px-3 py-2 ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "hover:bg-primary-200"
                    }`}
                    onClick={() => {
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </li>
                ))}
              </ul>
            </div>
            <ButtonIcon
              // + Go To Next Page
              clicked={() => {
                setCurrentPage(currentPage + 1);
              }}
              isDisabled={currentPage === pageNumbers.length}
              iconName="arrow-right"
              title="Next page"
            />
            {isShowSkipPageButton && (
              <ButtonIcon
                // + Go To Next pageSkipLevel Page
                clicked={() => {
                  setCurrentPage(
                    currentPage + pageSkipLevel <
                      pageNumbers[pageNumbers.length - 1]
                      ? currentPage + pageSkipLevel
                      : pageNumbers[pageNumbers.length - 1]
                  );
                }}
                isDisabled={currentPage === pageNumbers.length}
                iconName="arrow-block-right"
                title="Next 5 page"
              />
            )}
            {isShowSkipFirstLastPageButton &&
              currentPage != pageNumbers[pageNumbers.length - 1] && (
                <span
                  // + Go To Last Page
                  onClick={() => {
                    setCurrentPage(pageNumbers[pageNumbers.length - 1]);
                  }}
                >
                  Last
                </span>
              )}
          </nav>
        </div>
      </div>
    </div>
  );
});

export default Pagination;
