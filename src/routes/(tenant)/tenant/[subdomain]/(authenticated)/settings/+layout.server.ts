import { error } from "@sveltejs/kit";

export function load({ locals }) {
  if (!locals.user?.role || locals.user.role !== "admin") {
    error(401, "Unauthorized");
  }
}
