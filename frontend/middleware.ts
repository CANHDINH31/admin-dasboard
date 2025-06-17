import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user");
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Nếu chưa đăng nhập và không phải trang login -> chuyển về trang login
  if (!user && !isLoginPage) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Xóa cookie nếu có
    response.cookies.delete("user");
    return response;
  }

  // Nếu đã đăng nhập và đang cố truy cập trang login -> chuyển về trang chủ
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Cấu hình các đường dẫn cần áp dụng middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
