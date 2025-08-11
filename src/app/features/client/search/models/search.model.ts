import { Movie } from '@features/client/movies/models/movie.model';
import { Person } from '@features/client/people/models/person.model';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';

export type SearchResult = Movie | Person | TVShow;

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}
