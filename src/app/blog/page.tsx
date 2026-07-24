import { ComingSoon } from "@/components/placeholder"
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Typing Tips, Guides & Updates",
  description: "Read the latest tips on how to improve your typing speed, master government typing exams, and choose the right keyboard.",
  canonical: "/blog",
});

export default function BlogPage() {
  return <ComingSoon title="Blog" />
}
