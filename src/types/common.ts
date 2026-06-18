export type SingleApiResponse<T> = { data: T; content: T };

export type ListApiResponse<T> = {
  content: T;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
