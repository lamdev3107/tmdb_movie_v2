export interface Account {
  id: number;
  fullName?: string | null;
  role?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  include_adult?: boolean | null;
  username?: string | null;
  created_at?: string;
}

export interface AccountStates {
  inFavourite: boolean;
  inUserList: boolean;
  isRated: boolean;
  ratingScore: number | null;
}
