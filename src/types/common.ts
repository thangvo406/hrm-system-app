export type SingleApiResponse<T> = { data: T; content: T };

export type ListApiResponse<T> = {
  content: T;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export interface AppCallback {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (data?: any) => void;
}

export interface IImage {
    readonly filePath: string;
    readonly fileUrl: string;
}
