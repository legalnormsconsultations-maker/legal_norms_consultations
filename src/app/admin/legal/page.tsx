import { getLegalPage } from "./actions";
import { LegalPagesClient } from "./client-page";

export const metadata = {
  title: "Legal Pages | Admin Panel",
};

export default async function LegalPagesAdmin() {
  const [privacy, terms] = await Promise.all([
    getLegalPage("privacy"),
    getLegalPage("terms"),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Legal Pages</h1>
        <p className="text-slate-500 mt-2">Update the content for the Privacy Policy and Terms of Service pages.</p>
      </div>
      <div className="mt-8">
        <LegalPagesClient
          initialPrivacy={privacy?.richTextContent || ""}
          initialTerms={terms?.richTextContent || ""}
        />
      </div>
    </div>
  );
}
