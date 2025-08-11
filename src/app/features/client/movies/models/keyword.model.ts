export interface Keyword {
  id: number;
  name: string;
}

export interface KeywordResponse {
  id: number;
  keywords: Keyword[];
}
