// Article types for the frontend
export interface Article {
  _id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse {
  success: boolean;
  data: Article[];
  count?: number;
  message?: string;
}
