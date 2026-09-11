export const DEFAULT_AUTH_REDIRECT = "/learn";

export function getSafeRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  try {
    const url = new URL(value, "http://quantlearn.local");

    if (url.origin !== "http://quantlearn.local") {
      return DEFAULT_AUTH_REDIRECT;
    }

    if (url.pathname === "/login" || url.pathname.startsWith("/auth/")) {
      return DEFAULT_AUTH_REDIRECT;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}
