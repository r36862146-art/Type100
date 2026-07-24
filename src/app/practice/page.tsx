import { PracticeClient } from "./PracticeClient";
import { constructMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "1 Minute Typing Test & Practice",
  description: "Take a 1 minute typing test to check your WPM and accuracy. Practice for speed and consistency.",
  canonical: "/practice",
});

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
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Type100X Typing Practice",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }} />
      <PracticeClient initialConfig={initialConfig} />
    </div>
  );
}
