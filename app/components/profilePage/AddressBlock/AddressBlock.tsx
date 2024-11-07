/**
 * Developed by Fahim Hossain
 * Designation: Senior Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
import Icon from "@library/Icon";
import { Address } from "@utils/interfaces/DataModels/MCIPatientInterface";
import { selectDistrictFromCode, selectDivisionFromCode, selectUpazilaFromCode } from "@utils/utilityFunctions";
import { memo } from "react";

export interface AddressProps {
  addressHeader: string | null;
  address: Address | null;
}
export interface AddressBlockProps {
  items: AddressProps[] | null;
}

function AddressBlock({ items }: AddressBlockProps) {
  return (
    <div className="rounded-lg rounded-t-none bg-white p-24 shadow-lg">
      {/* <h5 className="mb-40 underline underline-offset-[12px] text-slate-600">Personal Info</h5> */}

      {items !== null && items.length > 0 ? (
        <div className="grid grid-cols-1 gap-0">
          {items.map((item, key) => (
            <div key={key.toString()} className="mt-12">
              <div className="grid-item">
                <div className="flex gap-x-12">
                  <Icon className="mt-2 stroke-primary" iconName="home-04" />
                  <div className="info">
                    <h6 className=" mb-8">{item.addressHeader}</h6>
                    <span>
                      {item.address?.address_line && (
                        <span className={'info flex justify-start items-start space-x-4'}>
                          <p className={'text-sm h-46 font-semibold'}>Address line: </p>
                          <p className='text-sm  h-46'>{item.address?.address_line}</p>
                        </span>
                      )}

                      {item.address?.upazila_id &&
                        item.address?.district_id && (
                        <span className={'info flex justify-start items-start space-x-4'}>
                          <p className={'text-sm h-46 font-semibold'}>Upazlia: </p>
                          <p className='text-sm  h-46'>{selectUpazilaFromCode(
                            item.address?.district_id +
                            " " +
                            item.address?.upazila_id
                          )}</p>
                        </span>
                        )}

                      {item.address?.district_id &&
                          <span className={'info flex justify-start items-start space-x-4'}>
                          <p className={'text-sm h-46 font-semibold'}>District: </p>
                          <p className='text-sm  h-46'>{selectDistrictFromCode(item.address?.district_id)}</p>
                        </span>
                        }

                      {item.address?.division_id &&
                        <span className={'info flex justify-start items-start space-x-4'}>
                          <p className={'text-sm h-46 font-semibold'}>Division: </p>
                          <p className='text-sm  h-46'>{selectDivisionFromCode(item.address?.division_id)}</p>
                        </span>
                      }
                      {item.address?.country_code &&
                        <span className={'info flex justify-start items-start space-x-4'}>
                          <p className={'text-sm h-46 font-semibold'}>Country: </p>
                          <p className='text-sm  h-46'>{selectDivisionFromCode(item.address?.country_code)}</p>
                        </span>
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) :
        <div className="mt-12">
          <div className="grid-item">
            <div className="flex gap-x-12">
              <Icon
                className="mt-3 stroke-primary"
                iconName="home-04"
                iconSize="16"
              />
              <div className="info space-y-4">
                <h6>No Addresses available</h6>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default memo(AddressBlock);
