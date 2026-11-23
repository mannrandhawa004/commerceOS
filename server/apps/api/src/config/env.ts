import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: [".env", "../../.env"] });

const envSchema = z.object({
    NODE_ENV : z
            .enum(["development", "production", "test"])
            .default("development"),
    PORT : z.coerce.number().default(5000),

    API_PREFIX : z.string().default("/api/v1"),

    MONGODB_URI : z.string().min(1),

    REDIS_HOST : z.string().default("localhost"),

    REDIS_PORT : z.coerce.number().default(6379),

    REDIS_PASSWORD : z.string().optional(),

    FRONTEND_URL : z.string().url(),

    LOG_LEVEL : z
        .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
        .default("debug")

});


const result = envSchema.safeParse(process.env);

if(!result.success){
    console.error("Invalid environment configuration:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = result.data;
