import { H1, H2, Paragraph } from "@/components/ui/typography";
import DynamicCards from "@/components/dynamic-cards";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-12 pb-24 px-4">
      <div className="text-center space-y-4 mb-12">
        <H1>About Legalnorms</H1>
        <Paragraph className="text-xl text-muted-foreground">
          Bringing transparency and speed to medical regulatory intelligence.
        </Paragraph>
      </div>

      <div className="space-y-4">
        <H2>Our Mission</H2>
        <Paragraph className="text-muted-foreground leading-relaxed">
          We believe that regulatory data should be accessible, structured, and
          actionable. Our platform ingests millions of data points across global
          health authorities to provide researchers and medical professionals
          with real-time insights into drug lifecycles, safety updates, and
          regulatory decisions.
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-secondary p-6 rounded-lg border border-slate-100">
          <h3 className="font-semibold text-lg mb-2 text-foreground">
            For Researchers
          </h3>
          <p className="text-muted-foreground">
            Track investigational compounds and monitor clinical trial
            regulatory status.
          </p>
        </div>
        <div className="bg-secondary p-6 rounded-lg border border-slate-100">
          <h3 className="font-semibold text-lg mb-2 text-foreground">
            For Compliance
          </h3>
          <p className="text-muted-foreground">
            Ensure adherence to the latest FDA, EMA, and CDSCO guidelines and
            safety warnings.
          </p>
        </div>
      </div>

      <DynamicCards pageName="about" />
    </div>
  );
}
