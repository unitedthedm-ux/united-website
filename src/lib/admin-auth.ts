import { createHmac } from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.NEXTAUTH_SECRET ?? "fallback-secret";
const COOKIE = "admin_session";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function setAdminCookie() {
  const payload = "admin";
  const sig = sign(payload);
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return false;
  return sign(payload) === sig && payload === "admin";
}

export function isAdminAuthenticatedFromHeader(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE}=([^;]+)`));
  if (!match) return false;
  const raw = match[1];
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return false;
  return sign(payload) === sig && payload === "admin";
}
