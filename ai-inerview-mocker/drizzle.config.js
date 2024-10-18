/**@type { import("drizzle-kit").Config} */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:S4TXMce5fLzY@ep-aged-brook-a5ridhuv.us-east-2.aws.neon.tech/ai-interview-mocker-app?sslmode=require",
  },
};
