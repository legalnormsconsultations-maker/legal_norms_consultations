"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { updateLegalPage } from "./actions";

// Import RichTextEditor dynamically as it relies on window/browser APIs
const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
});

export function LegalPagesClient({
  initialPrivacy,
  initialTerms,
}: {
  initialPrivacy: string;
  initialTerms: string;
}) {
  const [privacyContent, setPrivacyContent] = useState(initialPrivacy);
  const [termsContent, setTermsContent] = useState(initialTerms);

  const privacyEditorRef = useRef<any>(null);
  const termsEditorRef = useRef<any>(null);

  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [isSavingTerms, setIsSavingTerms] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSavePrivacy = async () => {
    setIsSavingPrivacy(true);
    try {
      const contentToSave = privacyEditorRef.current?.getContents() || privacyContent;
      await updateLegalPage("privacy", contentToSave);
      showToast("Privacy Policy updated successfully!");
    } catch (e) {
      showToast("Failed to update Privacy Policy");
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const handleSaveTerms = async () => {
    setIsSavingTerms(true);
    try {
      const contentToSave = termsEditorRef.current?.getContents() || termsContent;
      await updateLegalPage("terms", contentToSave);
      showToast("Terms of Service updated successfully!");
    } catch (e) {
      showToast("Failed to update Terms of Service");
    } finally {
      setIsSavingTerms(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      {/* Privacy Policy Section */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Update Privacy Policy
          </h2>
          <button
            onClick={handleSavePrivacy}
            disabled={isSavingPrivacy}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSavingPrivacy ? "Saving..." : "Save Privacy Policy"}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          This content will be displayed on the public Privacy Policy page.
        </p>
        <div className="bg-white text-black min-h-[400px]">
          <RichTextEditor
            ref={privacyEditorRef}
            value={privacyContent}
            onChange={setPrivacyContent}
            placeholder="Write privacy policy content here..."
          />
        </div>
      </section>

      {/* Terms of Service Section */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Update Terms of Service
          </h2>
          <button
            onClick={handleSaveTerms}
            disabled={isSavingTerms}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSavingTerms ? "Saving..." : "Save Terms of Service"}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          This content will be displayed on the public Terms of Service page.
        </p>
        <div className="bg-white text-black min-h-[400px]">
          <RichTextEditor
            ref={termsEditorRef}
            value={termsContent}
            onChange={setTermsContent}
            placeholder="Write terms of service content here..."
          />
        </div>
      </section>
    </div>
  );
}
