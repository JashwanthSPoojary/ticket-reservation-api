export interface AppConfig {
  port: number;
  env: 'development' | 'production' | 'test';
  apiPrefix: string;
}

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || '3000'),
  env: (process.env.NODE_ENV as any) || 'development',
  apiPrefix: '/api/v1',
};