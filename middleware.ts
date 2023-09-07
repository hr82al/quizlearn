export { default } from "next-auth/middleware";

export const config = { matcher: [
  "/learn",
  "/admin/quiz", 
  "/admin/quiz_list",
  "/api/admin",
] };