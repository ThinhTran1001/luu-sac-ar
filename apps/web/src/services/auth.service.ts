import { api } from '../lib/api';
import { LoginDto, RegisterDto, AuthResponseDto, API_ROUTES } from '@luu-sac/shared';

export const authService = {
  login: async (dto: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.LOGIN}`,
      dto,
    );
    return response.data;
  },

  register: async (dto: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.REGISTER}`,
      dto,
    );
    return response.data;
  },

  googleLogin: async (token: string): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.GOOGLE}`,
      { token },
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post(`${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.FORGOT_PASSWORD}`, { email });
  },

  resetPassword: async (dto: any): Promise<void> => {
    await api.post(`${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.RESET_PASSWORD}`, dto);
  },
};
