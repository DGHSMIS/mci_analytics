/**
 * ! The common interface for all API responses
 * ! This interface isn't used anywhere accept in faker
 */
export interface ApiResponseProps {
  data: ModelObjectProps[];
  status: number;
}

/**
 * ! The actual dynamic object type that will be consumed by the Promise constructor
 */
export interface ModelObjectProps {
  id: number;
  [key: string]: any;
}
