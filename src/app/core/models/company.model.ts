export interface Company {
  id: number;
  name: string;
  logoPath: string;
  logoPublicId: string;
}

export interface CompanyResponseData {
  metaInfo: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  results: Company[]; // Hoặc có thể định nghĩa rõ interface cho từng phần tử nếu biết cấu trúc chi tiết
}
