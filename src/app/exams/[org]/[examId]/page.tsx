import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { examProfiles } from "@/data/examProfiles";
import { 
  Play, 
  ChevronLeft,
  Clock,
  Zap,
  Languages,
  BookOpen
} from "lucide-react";

export default async function ExamDetailPage({ 
  params 
}: { 
  params: Promise<{ org: string; examId: string }> 
}) {
  const resolvedParams = await params;
  const exam = examProfiles.find(e => e.id === resolvedParams.examId);
  
  if (!exam) {
    notFound();
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Link 
        href="/exams" 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Exams
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              {exam.organization}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              {exam.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {exam.about}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Speed Required</span>
              </div>
              <p className="font-bold text-2xl text-foreground">{exam.speedRequirement} WPM</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Test Duration</span>
              </div>
              <p className="font-bold text-2xl text-foreground">{exam.duration} Min</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Languages className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <p className="font-bold text-2xl text-foreground truncate">{exam.language}</p>
            </div>
          </div>
          
          <div>
             <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 mt-8">
               <BookOpen className="text-primary w-6 h-6" /> Practice Passages
             </h2>
             <p className="text-muted-foreground mb-4">Practice typing with text in the style of the official {exam.name} examination without running a full timed mock test.</p>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {[1, 2, 3].map((setId) => (
                 <Link 
                   key={`practice_${setId}`}
                   href={`/practice?mode=exam&examId=${exam.id}&examType=practice&examSetId=${setId}`}
                   className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 py-4 px-4 rounded-xl font-semibold transition-colors"
                 >
                   Practice Set {setId}
                 </Link>
               ))}
             </div>
          </div>
        </div>

        {/* Right Column: CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-primary/20 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Official Mock Test</h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Enter a realistic simulation of the {exam.name} typing test. Complete with official rules, restricted tools, and an Exam Readiness Report.
            </p>
            
            <Link 
              href={`/exams/${resolvedParams.org}/${exam.id}/mock`}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-4 px-6 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-md shadow-primary/25"
            >
              Start Mock Test
            </Link>
            
            <p className="text-xs text-muted-foreground mt-6 italic">
              Timer begins only after reading the instructions on the next screen.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
