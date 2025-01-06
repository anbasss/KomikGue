"use client";

import { useParams } from "next/navigation";
import ChapterDetail from "@/component/ChapterDetail";

export default function ChapterDetailPage() {
  const params = useParams();
  const chapterId = params?.chapterId;
  return <ChapterDetail chapterId={chapterId} />;
}
