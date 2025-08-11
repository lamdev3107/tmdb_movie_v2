export interface Image {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
}

export interface ImagesResponse {
  backdrops: Image[];
  posters: Image[];
  id: string;
}
