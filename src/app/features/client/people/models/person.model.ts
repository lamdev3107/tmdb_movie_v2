import { Movie } from '@features/client/movies/models/movie.model';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';

// Định nghĩa interface cho Person
export interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  known_for: Movie[] | TVShow[];
}

export interface PeopleResponse {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

export interface PersonDetail {
  birthday: string | null;
  known_for_department: string;
  deathday: string | null;
  id: number;
  name: string;
  also_known_as: string[];
  gender: number;
  biography: string;
  popularity: number;
  place_of_birth: string;
  profile_path: string | null;
  imdb_id: string;
  homepage: string | null;
}
export interface CastJob {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string | null;
  name: string;
  vote_average: number;
  vote_count: number;
  character: string;
  credit_id: string;
  episode_count: number;
  first_credit_air_date: string | null;
  media_type: string;
}
export interface CrewJob {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string | null;
  name: string;
  vote_average: number;
  vote_count: number;
  credit_id: string;
  department: string;
  episode_count: number;
  first_credit_air_date: string | null;
  job: string;
  media_type: string;
}

export interface combinedCreditResponse {
  id: number;
  cast: CastJob[];
  crew: CrewJob[];
}
