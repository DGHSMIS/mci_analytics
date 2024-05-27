
export interface EncounterListProps {
  encounters: EncounterListItem[];
}
export interface EncounterListItem {
  id: string;
  facility_id: string;
  facility_name: string;
  facility_location: string;
  facility_type: string;
  encounter_time: Date;
  encounter_confidentiality?: boolean;
}