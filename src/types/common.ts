export type SingleApiResponse<T> = { data: T };

export type ListApiResponse<T> = {
  content: T;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type AppCallback<T = void> = {
  readonly onFailure?: (error: string, additional?: any) => void;
  readonly onSuccess?: (data: T) => void;
};

export type IImage = {
  readonly filePath: string;
  readonly fileUrl: string;
};
export type SearchAddressItem = {
  id: string;

  roadAddress?: string;
  landAddress?: string;

  postalCode?: string;

  province?: string;
  district?: string;
  town?: string;

  longitude: string;
  latitude: string;
  detail: KakaoDocument;
};

export interface KakaoDocument {
  address: KakaoAddress;
  address_name: string;
  address_type: string;
  road_address: RoadAddress;
  x: string;
  y: string;
}

export interface KakaoAddress {
  address_name: string;
  b_code: string;
  h_code: string;
  main_address_no: string;
  mountain_yn: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_h_name: string;
  region_3depth_name: string;
  sub_address_no: string;
  x: string;
  y: string;
}

export interface RoadAddress {
  address_name: string;
  building_name: string;
  main_building_no: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  road_name: string;
  sub_building_no: string;
  underground_yn: string;
  x: string;
  y: string;
  zone_no: string;
}
