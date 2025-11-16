import { NextResponse } from "next/server";
import { authenticateUser, generateSession, clearSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ message: "缺少邮箱或密码" }, { status: 400 });
  }
  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json({ message: "账号或密码错误" }, { status: 401 });
  }
  await generateSession(user.id);
  return NextResponse.json({ message: "登录成功", user: { email: user.email, displayName: user.displayName } });
}

export async function DELETE() {
  clearSession();
  return NextResponse.json({ message: "已退出" });
}
