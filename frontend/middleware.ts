import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { menuItems } from "./config/menu-items";

export function middleware(request: NextRequest) {
  // Bỏ qua các route không cần kiểm tra quyền
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Lấy user data từ cookies
  const userData = request.cookies.get("user")?.value;
  if (!userData) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const user = JSON.parse(userData);
    const currentPath = request.nextUrl.pathname;

    // Kiểm tra xem path hiện tại có trong menu items không
    const menuItem = menuItems.find((item) => item.url === currentPath);
    if (menuItem) {
      // Nếu có trong menu items, kiểm tra quyền
      if (!user.permissions.includes(menuItem.permission)) {
        // Nếu không có quyền, chuyển hướng về trang chủ
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error parsing user data:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Cấu hình các đường dẫn cần áp dụng middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
