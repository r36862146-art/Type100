import React from "react";
import { notFound } from "next/navigation";
import { examProfiles } from "@/data/examProfiles";
import { MockPageClient } from "./MockPageClient";

export default async function MockExamPage({ 
  params 
}: { 
  params: Promise<{ org: string; examId: string }> 
}) {
  const resolvedParams = await params;
  const exam = examProfiles.find(e => e.id === resolvedParams.examId);
  
  if (!exam) {
    notFound();
  }

  return <MockPageClient exam={exam} />;
}
