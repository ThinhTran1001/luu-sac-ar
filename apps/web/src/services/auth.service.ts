import { api, extractData } from '../lib/api';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  ResetPasswordDto,
  API_ROUTES,
  ApiResponse,
} from '@luu-sac/shared';

export const authService = {
  login: async (dto: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post<ApiResponse<AuthResponseDto>>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.LOGIN}`,
      dto,
    );
    return extractData(response);
  },

  register: async (dto: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post<ApiResponse<AuthResponseDto>>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.REGISTER}`,
      dto,
    );
    return extractData(response);
  },

  googleLogin: async (token: string): Promise<AuthResponseDto> => {
    const response = await api.post<ApiResponse<AuthResponseDto>>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.GOOGLE}`,
      { token },
    );
    return extractData(response);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post<ApiResponse<{ message: string }>>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.FORGOT_PASSWORD}`,
      { email },
    );
  },

  resetPassword: async (dto: ResetPasswordDto): Promise<void> => {
    await api.post<ApiResponse<{ message: string }>>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.RESET_PASSWORD}`,
      dto,
    );
  },
};
