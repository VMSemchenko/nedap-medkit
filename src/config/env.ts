import { parseEnv } from "./parse-env";

export const config = parseEnv(import.meta.env);
