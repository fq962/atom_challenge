export interface UserResponse {
  success: boolean;
  message: string;
  token: string;
  exists: boolean;
}

export interface User {
  id_user: string;
  mail: string;
}
