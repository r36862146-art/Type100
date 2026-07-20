import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"

interface ComingSoonProps {
  title: string
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <Section className="flex-1 flex items-center justify-center min-h-[50vh]">
      <Container className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground">
          This feature is currently under construction. Check back soon.
        </p>
      </Container>
    </Section>
  )
}
