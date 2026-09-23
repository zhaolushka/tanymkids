"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentMessagesPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t.parent.messagesTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.parent.messagesDesc}</p>
      </div>
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <MessageCircle className="h-14 w-14 text-muted-foreground/70" strokeWidth={1.25} aria-hidden />
        <p className="font-semibold">{t.parent.messagesEmpty}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{t.parent.messagesEmptyHint}</p>
        <Link href="/parent/network" className="text-sm font-bold text-primary hover:underline">
          {t.parent.messagesFindDoctor}
        </Link>
      </Card>
    </div>
  );
}
