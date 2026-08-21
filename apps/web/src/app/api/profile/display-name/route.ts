import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

const MAX_DISPLAY_NAME_LENGTH = 12;

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse("UNAUTHORIZED", "请先登录", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_JSON", "请求内容必须是有效的 JSON", 400);
  }

  const rawDisplayName =
    typeof body === "object" && body !== null && "displayName" in body
      ? (body as { displayName?: unknown }).displayName
      : undefined;

  if (typeof rawDisplayName !== "string") {
    return errorResponse("INVALID_DISPLAY_NAME", "请输入昵称", 400);
  }

  const displayName = rawDisplayName.trim();
  const characterCount = Array.from(displayName).length;
  if (characterCount < 1 || characterCount > MAX_DISPLAY_NAME_LENGTH) {
    return errorResponse(
      "INVALID_DISPLAY_NAME",
      `昵称长度需要在 1-${MAX_DISPLAY_NAME_LENGTH} 个字符之间`,
      400,
    );
  }
  if (/[\u0000-\u001f\u007f]/u.test(displayName)) {
    return errorResponse("INVALID_DISPLAY_NAME", "昵称不能包含控制字符", 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { name: displayName },
    select: { name: true },
  });

  return NextResponse.json(
    { data: { displayName: updatedUser.name ?? displayName } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
