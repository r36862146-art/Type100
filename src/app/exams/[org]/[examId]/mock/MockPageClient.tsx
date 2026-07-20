"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ExamDetail } from "@/data/examProfiles";
import { ExamInstructionScreen } from "@/features/exams/components/ExamInstructionScreen";

export function MockPageClient({ exam }: { exam: ExamDetail }) {
  const router = useRouter();

  const handleStart = () => {
    // Navigate to the practice route with the mock exam configuration
    // examSetId=1 is arbitrary, we could randomise or track it, but 1 works for now
    router.push(`/practice?mode=exam&examId=${exam.id}&examType=mock&examSetId=1`);
  };

  return <ExamInstructionScreen exam={exam} onStart={handleStart} />;
}
