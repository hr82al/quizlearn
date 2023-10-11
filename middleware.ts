export { default } from "next-auth/middleware";

export const config = { matcher: [
  "/",
  "/add-quiz",
  "/api/quiz/:path*",
  "/quiz",
] };