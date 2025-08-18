export interface AdminPerson {
  id: number;
  name: string;
  career: string;
  biography: string;
  birthDate: string;
  placeOfBirth: string;
  deathDate?: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  profilePath: string;
  profilePublicId: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string | null;
  updated_by?: string | null;
}

export interface AdminPeopleResponseData {
  metaInfo: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  results: AdminPerson[]; // Hoặc có thể định nghĩa rõ interface cho từng phần tử nếu biết cấu trúc chi tiết
}

export const jobOptions = [
  { value: 'Casting', label: 'Casting' },
  { value: 'Director', label: 'Director' },
  { value: 'Producer', label: 'Producer' },
  { value: 'Writer', label: 'Writer' },
  { value: 'Editor', label: 'Editor' },
  { value: 'Camera', label: 'Camera' },
];

export const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Others' },
];
