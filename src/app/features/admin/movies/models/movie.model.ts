export interface MovieBody {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string;
  runtime: number;
  voteAverage?: number;
  voteCount?: number;
  trailerUrl?: string;
  budget?: number;
  revenue?: number;
  tagline?: string;
  homepageUrl?: string;
  status?: string;
  poster?: File;
  backdrop?: File;
  countryIds?: number[];
  languageIds?: number[];
  companyIds?: number[];
  cast: {
    personId: number;
    character: string | null;
    job: string | null;
  }[];
  genreIds: number[];
  // Có thể bổ sung các trường khác nếu cần thiết
}

export const movieStatus = [
  'Released',
  'In Production',
  'Post Production',
  'Canceled',
  'Planned',
];
export interface MovieResponseData {
  metaInfo: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  results: any[]; // Hoặc có thể định nghĩa rõ interface cho từng phần tử nếu biết cấu trúc chi tiết
}
