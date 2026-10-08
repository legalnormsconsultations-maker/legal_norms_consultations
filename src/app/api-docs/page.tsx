import { H1, H2, Paragraph } from "@/components/ui/typography";

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-12 pb-24">
      <div className="space-y-4">
        <H1>API Documentation</H1>
        <Paragraph className="text-lg text-muted-foreground">
          Integrate Legalnorms data directly into your workflows using our
          RESTful API.
        </Paragraph>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 shadow-xl overflow-hidden">
        <div className="flex items-center space-x-2 mb-4 text-slate-400 text-sm">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 font-mono">bash</span>
        </div>
        <pre className="text-emerald-400 font-mono text-sm overflow-x-auto">
          <code>
            {`curl -X GET "https://api.legalnorms.com/v1/drugs?q=aspirin" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
          </code>
        </pre>
      </div>

      <div className="space-y-4">
        <H2>Authentication</H2>
        <Paragraph className="text-muted-foreground">
          All API requests require a valid API key passed in the Authorization
          header. You can generate an API key from your developer dashboard.
        </Paragraph>
      </div>
    </div>
  );
}
