import React from "react";
import Link from "next/link";
import { examProfiles, ExamCategory } from "@/data/examProfiles";
import { ChevronRight, GraduationCap, Building, Train, Globe } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Typing Practice for Government Exams (SSC, RRB)",
  description: "Your complete educational hub for government typing skill tests. Practice with official-style passages for SSC, RRB, and more.",
  canonical: "/exams",
});

export default function ExamsPage() {
  // Group exams by organization
  const groupedExams = examProfiles.reduce((acc, exam) => {
    if (!acc[exam.organization]) {
      acc[exam.organization] = [];
    }
    acc[exam.organization].push(exam);
    return acc;
  }, {} as Record<ExamCategory, typeof examProfiles>);

  const getOrgIcon = (org: ExamCategory) => {
    switch (org) {
      case "SSC": return <Building className="w-5 h-5 text-blue-500" />;
      case "RRB": return <Train className="w-5 h-5 text-orange-500" />;
      case "Andaman Administration": return <Globe className="w-5 h-5 text-emerald-500" />;
      default: return <GraduationCap className="w-5 h-5" />;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12 animate-in fade-in zoom-in duration-500">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3">
          <GraduationCap className="w-10 h-10 text-primary" />
          Explore Exams
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your complete educational hub for government typing skill tests. 
          Understand the exam patterns, learn the passing criteria, and practice with official-style passages.
        </p>
      </div>

      <div className="space-y-12">
        {(Object.keys(groupedExams) as ExamCategory[]).map(org => (
          <section key={org} className="space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              {getOrgIcon(org)}
              <h2 className="text-2xl font-bold">{org}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedExams[org].map(exam => {
                const orgSlug = org.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link 
                    key={exam.id} 
                    href={`/exams/${orgSlug}/${exam.id}`}
                    className="group block"
                  >
                    <div className="h-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {exam.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {exam.about}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-4 border-t border-border/50">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                          {exam.speedRequirement} WPM
                        </span>
                        <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View Details <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
