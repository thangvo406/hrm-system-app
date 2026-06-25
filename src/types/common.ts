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
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (data: T) => void;
};

export type IImage = {
  readonly filePath: string;
  readonly fileUrl: string;
};
