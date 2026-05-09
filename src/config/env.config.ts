import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  //server
  NODE_ENV: z
    .enum(["DEVELOPMENT", "TEST", "PRODUCTION"])
    .default("DEVELOPMENT"),
  PORT: z.string().default("5000").transform(Number),

  //mongodb
  MONGODB_URI: z.url({ message: "MONGODB_URI must be a valid URL" }),
  FRONTEND_URL: z.url().default("http://localhost:5173"),
  BCRYPT_SALT_ROUND: z.string().default("10").transform(Number),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("1d"),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default("15d"),
});

// --------------------parsed and validate on startup--------------------

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error("\n❌ Invalid environment Variables: \n");

  _parsed.error.issues.forEach((issue) => {
    console.error(`${issue.path.join(".")}:${issue.message}`);
  });
  console.error("\n Fix the above and restart the server. \n");
  process.exit(1);
}

const env = _parsed.data; //now safe
export default env;
