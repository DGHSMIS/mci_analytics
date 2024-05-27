import Icon, { IconProps } from "@library/Icon";
import PageHeader from "@library/PageHeader";
import Link from "next/link";
import { memo } from "react";
import twcolors from "tailwindcss/colors";

export interface ReportItemProps {
  title: string;
  id: number;
  icon?: IconProps["iconName"];
  categoryName?: string;
  categoryId?: number;
  pagePath?: string;
}

export interface ReportGroupProps {
  title?: string;
  icon?: IconProps["iconName"];
  reports: ReportItemProps[];
}
const ReportGroup = memo(function ReportGroup({
  title = "",
  icon = "",
  reports,
}: ReportGroupProps) {
  return (
    <div className="altd-report-group">
      {title.length > 0 && (
        // <h5 className="mb-12">{title}</h5>
        <PageHeader
          title={title}
          className="mb-12"
          variant="neutral"
          titleSize="sm"
        />
      )}
      <div className="mb-20 grid grid-cols-2 gap-20 lg:grid-cols-4 2xl:grid-cols-6">
        {reports.map((item: ReportItemProps, index: number) => (
          <Link
            href={`${
              item.pagePath ? item.pagePath : "data/reports/view/" + item.id
            }`}
            className="flex min-h-[80px] items-center justify-center rounded-md border border-slate-200 bg-slate-100 px-16 py-12 text-slate-700 hover:border-slate-300 hover:bg-slate-200"
            key={index}
          >
            {item.icon ? (
              <>
                {item.categoryName !== undefined && (
                  <small className="mb-8 block uppercase text-slate-500">
                    {item.categoryName}
                  </small>
                )}
                <div className="flex space-x-8">
                  <Icon
                    iconName={item.icon}
                    iconSize="24"
                    iconStrokeWidth="1.5"
                    iconColor={twcolors.slate[500]}
                  />
                  <p className="line-clamp-3"> {item.title}</p>
                </div>
              </>
            ) : (
              <>
                {item.categoryName !== undefined && (
                  <small className="mb-8 block uppercase text-slate-500">
                    {item.categoryName}
                  </small>
                )}
                <p className="line-clamp-3 ">{item.title}</p>
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
});

export default ReportGroup;
