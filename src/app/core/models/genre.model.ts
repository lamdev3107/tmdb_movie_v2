export interface GenreListResponse {
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreResponseData {
  metaInfo: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  results: Genre[]; // Hoặc có thể định nghĩa rõ interface cho từng phần tử nếu biết cấu trúc chi tiết
}

export interface GenreBody {
  id?: number;
  name: string;
}
