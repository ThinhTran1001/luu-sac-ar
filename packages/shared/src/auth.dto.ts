export interface RegisterDto {
  email: string;
  password?: string;
  name: string;
  avatar?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
  googleToken?: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
