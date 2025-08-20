namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_SECRET: string;
  }
}
