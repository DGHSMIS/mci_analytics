"use client";

import ButtonIcon from "@components/library/ButtonIcon";
import Icon from "@components/library/Icon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import twcolors from "tailwindcss/colors";

export function checkAndCapitalizeFirstLeter(string: string): string {
  if (!isUpperCase(string.charAt(0))) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
}

export function isUpperCase(myString: string) {
  return myString == myString.toUpperCase();
}

export interface BreadcrumbItemProps {
  title: string;
  link: string;
}

const Breadcrumb = memo(function Breadcrumb() {
  const router = useRouter();
  const pathname = usePathname();
  const initialVal: BreadcrumbItemProps[] = [];
  const [crumbLinkObj, setCrumbLinkObj] = useState(initialVal);
  useEffect(() => {
    let links = pathname ? pathname.split("/") : ["/"];
    let urlDefinations: Array<BreadcrumbItemProps> = [];

    let urlPath = "";
    links.forEach((element, index) => {
      if (process.env.debugComponents == "true") {
        console.log(element);
      }
      let pageTile: string = element.replace("-", " ");
      pageTile = checkAndCapitalizeFirstLeter(pageTile);
      if (index === 0) {
        urlPath = element;
      } else {
        urlPath = urlPath + "/" + element;
      }
      if (process.env.debugComponents == "true") {
        console.log(element);
        console.log(urlPath);
      }
      let item: BreadcrumbItemProps = {
        title: pageTile,
        link: urlPath,
      };
      urlDefinations.push(item);
    });
    setCrumbLinkObj(urlDefinations);
  }, [router, pathname]);

  return (
    <nav className="altd-breadcrumb flex w-full" aria-label="Breadcrumb">
      <ul className="inline-flex items-center space-x-4 md:space-x-1">
        {crumbLinkObj.map((item: BreadcrumbItemProps, index: number) =>
          index == 0 ? (
            //! Home Icon
            <li key={index} className="inline-flex items-center">
              <ButtonIcon
                clicked={() => router.push(item.link ? item.link : "/")}
                iconName="home-05"
                iconSize="12"
                iconStrokeWidth="2"
                iconColor={twcolors.slate[400]}
                className="hover:stroke-primary-500"
              />
            </li>
          ) : (
            <div className="space-x-4 md:space-x-1" key={index}>
              {/* Caret */}
              <Icon
                iconName="chevron-right"
                iconSize="16"
                iconStrokeWidth="1.5"
                iconColor={twcolors.slate[500]}
              />
              <li className="inline-flex items-center">
                <Link
                  key={index.toString()}
                  href={item.link}
                  className="text-sm font-medium leading-none tracking-tight text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            </div>
          )
        )}
      </ul>
    </nav>
  );
});
export default Breadcrumb;
