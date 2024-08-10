export interface RegisterResponse {
    success: boolean;
    message?: string;
  }

  export interface LoginResponse {
    token?: string;
    user?: {
      id: number;
      email: string;
    };
  }