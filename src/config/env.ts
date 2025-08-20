import "dotenv/config";

export const config = {
  port: process.env.PORT ?? 8000,
  env: process.env.NODE_ENV,
  database: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ?? 5432,
  },
  jwt: {
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? "refresh_secret",
    accessSecret: process.env.JWT_ACCESS_SECRET ?? "access_secret",
  },
};
