// "use client";
import Icon from "@library/Icon";
import {
  convertDateToReadableFormat,
  selectBloodGroupFromCode,
  selectDisabilityFromCode,
  selectEducationLevelFromCode,
  selectMaritalStatusFromCode,
  selectOccupationFromCode,
  selectReligionFromCode
} from "@utils/utilityFunctions";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";

export interface PersonalInfoProps {
  eduLevel?: string;
  pob?: string;
  dod?: string;
  nationality?: string;
  religion?: string;
  bloodGroup?: string;
  disability?: string;
  maritalStatus?: string;
  occupation?: string;
  confidential?: string;
  phone?: string;
}

const PersonalInfo = memo(function PersonalInfo({
  eduLevel,
  dod = "", //!date of death
  nationality = "",
  religion = "",
  bloodGroup = "",
  disability = "",
  maritalStatus = "",
  occupation = "",
  confidential = "",
}: PersonalInfoProps) {
  return (
    <div className="rounded-lg rounded-t-none bg-white p-32 grid shadow-lg">
      <div className="grid grid-cols-2 gap-40 lg:grid-cols-4">

        {dod !== undefined &&
          <div className="grid-item">
            <div className="flex gap-x-12">
              <Icon className="mt-3 stroke-primary" iconName="calendar" />
              <div className="info space-y-4">
                <h6>Date of Death</h6>
                <p>{dod !== undefined ? convertDateToReadableFormat(dod) : "N/A"}</p>
              </div>
            </div>
          </div>
          }

        <div className="grid-item">
          <div className="flex gap-x-12">
            <Icon
              className="mt-3 stroke-primary"
              iconName="graduation-hat-02"
            />
            <div className="info space-y-4">
              <h6>Education Level</h6>
              <p>{selectEducationLevelFromCode(eduLevel ?? "")}</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="flex gap-x-12">
            <Icon className="mt-3 stroke-primary" iconName="award-01" />
            <div className="info space-y-4">
              <h6>Nationality</h6>
              <p>{nationality}</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="flex gap-x-12">
            <Icon className="mt-3 stroke-primary" iconName="moon-star" />
            <div className="info space-y-4">
              <h6>Religion</h6>
              <p>{selectReligionFromCode(religion)}</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="flex gap-x-12">
            <Icon className="mt-3 stroke-primary" iconName="droplets-02" />
            <div className="info space-y-4">
              <h6>Blood Group</h6>
              <p>{selectBloodGroupFromCode(bloodGroup)}</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="flex gap-x-12">
            <Icon className="mt-3 stroke-primary" iconName="grid-dots-bottom" />
            <div className="info space-y-4">
              <h6>Disability</h6>
              <p>{selectDisabilityFromCode(disability)}</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="flex gap-x-12">
            <Icon className="mt-3 stroke-primary" iconName="intersect-circle" />
            <div className="info space-y-4">
              <h6>Marital Status</h6>
              <p>{selectMaritalStatusFromCode(maritalStatus)}</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="flex gap-x-12">
            <Icon className="mt-3 stroke-primary" iconName="briefcase-01" />
            <div className="info space-y-4">
              <h6>Occupation</h6>
              <p>{selectOccupationFromCode(occupation)}</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="flex gap-x-12">
            <Icon className="mt-3 stroke-primary" iconName="eye-off" />
            <div className="info space-y-4">
              <h6>Confidential</h6>
              <p>{confidential}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default PersonalInfo;

export const SkeletonPersonalInfo = memo(function SkeletonPersonalInfo() {
  return (
    <div className="rounded-lg rounded-t-none bg-white p-64 shadow-lg">
      <div className="grid grid-cols-2 gap-40 lg:grid-cols-4">
        <SkeletonCommon />
        <SkeletonCommon />
        <SkeletonCommon />
        <SkeletonCommon />
        <SkeletonCommon />
        <SkeletonCommon />
        <SkeletonCommon />
        <SkeletonCommon />
        <SkeletonCommon />

      </div>
    </div>
  );
});

const SkeletonCommon = memo(function SkeletonCommon() {
  return (
    <div className="grid-item">
      <div className="flex gap-x-12">
        <Skeleton width={16} height={16} circle={false} />
        <div className="info flex items-center justify-start w-[50%]">
          <Skeleton containerClassName={"flex-1"} count={2} />
        </div>
      </div>
    </div>
  );
});
