/**
 * Developed by Fahim Hossain
 * Designation: Senior Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
import Icon from "@library/Icon";
import { Address } from "@utils/interfaces/DataModels/MCIPatientInterface";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";

export interface AddressProps {
  addressHeader: string | null;
  address: Address | null;
}


function SkeletonAddressBlock() {

  const addressItem: AddressProps = {
    addressHeader: "",
    address: {
      address_line: "",
      upazila_id: "",
      district_id: "",
      division_id: "",
      country_code: "",
    },
  }

  const addresses: AddressProps[] = [addressItem];

  return (
    <div className="rounded-lg rounded-t-none bg-white p-24 shadow-lg">
      <div className="grid grid-cols-1 gap-0">
        {addresses.map((item, key) => (
          <div key={(key + 1).toString()} className="mt-12">
            <div className="grid-item">
              <div className="flex gap-x-12">
                <Icon className="mt-2 stroke-primary" iconName="home-04" />
                <div className="info">
                  <h6 className=" mb-8"><Skeleton count={1} height={20} width={120} /></h6>
                  <span>
                    <span className={'info flex justify-start items-start space-x-4'}>
                      <p className={'text-sm h-46 font-semibold'}>Address line: </p>
                      <p className='text-sm  h-46'><Skeleton count={1} height={16} width={80} /></p>
                    </span>

                    <span className={'info flex justify-start items-start space-x-4'}>
                      <p className={'text-sm h-46 font-semibold'}>Upazlia: </p>
                      <p className='text-sm  h-46'><Skeleton count={1} height={16} width={80} /></p>
                    </span>
                    <span className={'info flex justify-start items-start space-x-4'}>
                      <p className={'text-sm h-46 font-semibold'}>District: </p>
                      <p className='text-sm  h-46'><Skeleton count={1} height={16} width={80} /></p>
                    </span>

                    <span className={'info flex justify-start items-start space-x-4'}>
                      <p className={'text-sm h-46 font-semibold'}>Division: </p>
                      <p className='text-sm  h-46'><Skeleton count={1} height={16} width={80} /></p>
                    </span>
                    <span className={'info flex justify-start items-start space-x-4'}>
                      <p className={'text-sm h-46 font-semibold'}>Country: </p>
                      <p className='text-sm  h-46'><Skeleton count={1} height={16} width={80} /></p>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(SkeletonAddressBlock);
