export interface Country {
  id: number;
  name: string;
  countryCode: string;
}
export interface CountryResponseData {
  metaInfo: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  results: Country[];
}
