import { H1, H2, Paragraph } from "@/components/ui/typography";

export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-12 pb-24">
      <div className="space-y-4 border-b border-border pb-8">
        <H1>Legal & Privacy</H1>
        <Paragraph className="text-muted-foreground">
          Last updated: October 2026
        </Paragraph>
      </div>

      <div className="space-y-4">
        <H2>1. Terms of Service</H2>
        <Paragraph className="text-muted-foreground leading-relaxed">
          The information provided on Legalnorms is for informational and
          educational purposes only and does not constitute professional medical
          advice, diagnosis, or treatment. Users must independently verify all
          regulatory data with official sources such as the FDA or EMA.
        </Paragraph>
      </div>

      <div className="space-y-4 mt-8">
        <H2>2. Privacy Policy</H2>
        <Paragraph className="text-muted-foreground leading-relaxed">
          We collect standard usage data to improve our services. Portfolio data
          and custom notes are encrypted at rest and are only accessible by the
          authorized user. We do not sell your personal data to third-party data
          brokers.
        </Paragraph>
      </div>

      <div className="space-y-4 mt-8">
        <H2>3. Data Sources</H2>
        <Paragraph className="text-muted-foreground leading-relaxed">
          Regulatory events and documents are sourced from public health
          authority databases. While we strive for real-time accuracy, there may
          be a slight delay in syndication.
        </Paragraph>
      </div>
    </div>
  );
}
