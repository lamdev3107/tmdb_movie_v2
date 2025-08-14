export interface LoginResquest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}
export interface InfoResponse {
  id: number;
  username: string;
  role: string;
  fullName: string | null;
  description: string | null;
  avatarUrl: string | null;
}

export interface DataResponse {
  accessToken: string;
  infoResponse: InfoResponse;
}

export interface SuccessResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: DataResponse;
}
