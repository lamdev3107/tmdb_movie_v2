export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface MovieCast {
  characterName: string;
  job: string;
  personDTO: {
    biography: string;
    birthdate: string;
    career: string;
    created_at: string;
    created_by: string;
    deathdate: string | null;
    gender: string;
    id: number;
    name: string;
    placeOfBirth: string;
    profilePath: string;
    profilePublicId: string;
    updated_at: string;
    updated_by: string;
  };
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}
export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}
