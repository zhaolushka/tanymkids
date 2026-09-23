import { buildParentAssistantKnowledge } from "@/lib/ai/build-parent-context";
import { demoParentAssistantReply } from "@/lib/ai/demo-parent-assistant";
import { getDoctorByHandle } from "@/lib/doctors/catalog";
import type { Locale } from "@/i18n/types";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type ParentAssistantChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_RULES = `Ты — дружелюбный помощник TanymKids только для родителей.
Язык ответа: строго тот, что указан в locale (kk или ru).
Задачи: (1) мягко рекомендовать врачей из КАТАЛОГА ниже, опираясь на отзывы и специальность; (2) объяснять медицинские слова простым языком для родителей без мед. образования; (3) помогать составить черновик сообщения врачу — вежливо, коротко, без диагнозов от себя.
Запрещено: ставить диагноз, назначать лечение, выдумывать врачей не из каталога.
Если нужен врач — дай имя, специальность и путь /parent/doctors/{handle}.
В конце при необходимости напомни: окончательное решение — с живым специалистом.`;

async function callOpenAI(
  locale: Locale,
  knowledge: string,
  messages: ParentAssistantChatMessage[],
  doctorHandle?: string,
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const doctorCtx = doctorHandle
    ? getDoctorByHandle(doctorHandle)
    : undefined;
  const focus = doctorCtx
    ? `\nРодитель сейчас смотрит профиль врача: ${doctorCtx.fullName} (handle=${doctorCtx.handle}). Помогай писать ему сообщение.`
    : "";

  const body = {
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `${SYSTEM_RULES}\nlocale=${locale}${focus}\n\nКАТАЛОГ:\n${knowledge}`,
      },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("OpenAI parent-assistant error", res.status, await res.text());
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const role = cookieStore.get(AUTH_COOKIE.role)?.value;
  const pinOk = cookieStore.get(AUTH_COOKIE.pinUnlock)?.value === "1";

  if (role !== "parent" || !pinOk) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: {
    messages?: ParentAssistantChatMessage[];
    locale?: Locale;
    doctorHandle?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const locale: Locale = payload.locale === "ru" ? "ru" : "kk";
  const messages = (payload.messages ?? []).filter(
    (m) =>
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= 4000,
  );

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json({ error: "no_user_message" }, { status: 400 });
  }

  const knowledge = buildParentAssistantKnowledge(locale);
  const doctorHandle = payload.doctorHandle?.trim();

  let reply =
    (await callOpenAI(locale, knowledge, messages, doctorHandle)) ??
    demoParentAssistantReply(locale, lastUser.content, doctorHandle);

  return NextResponse.json({
    reply,
    mode: process.env.OPENAI_API_KEY?.trim() ? "cloud" : "demo",
  });
}
