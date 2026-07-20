import { Metadata } from "next";
import { PracticeClient } from "./PracticeClient";

export const metadata: Metadata = {
  title: "Practice Typing | Type100",
  description: "Improve your typing speed and accuracy with English and Hindi modes. Practice words, paragraphs, quotes, numbers, and custom text.",
  openGraph: {
    title: "Practice Typing | Type100",
    description: "Improve your typing speed and accuracy with English and Hindi modes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Practice Typing | Type100",
    description: "Improve your typing speed and accuracy with English and Hindi modes.",
  },
};

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  
  const initialConfig: any = {};
  
  if (resolvedParams.mode) initialConfig.mode = resolvedParams.mode as string;
  if (resolvedParams.examId) initialConfig.examId = resolvedParams.examId as string;
  if (resolvedParams.examType) initialConfig.examType = resolvedParams.examType as string;
  if (resolvedParams.examSetId) initialConfig.examSetId = resolvedParams.examSetId as string;
  if (resolvedParams.difficulty) initialConfig.difficulty = resolvedParams.difficulty as string;
  
  return (
    <div className="w-full h-full flex flex-col items-center pt-8 pb-16">
      <PracticeClient initialConfig={initialConfig} />
    </div>
  );
}
