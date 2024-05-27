import React, { memo } from "react";

interface KeyValueFormItemProps {
  title: string;
  value: string;
}
export default memo(function KeyValueFormItem(keyValuePair: KeyValueFormItemProps) {

  return <div className='grid grid-cols-12'>
    <div className='col-span-4 text-sm text-slate-500'>{keyValuePair.title}</div>
    <div className='col-span-8 text-sm text-slate-800'>{keyValuePair.value}</div>
  </div>
})