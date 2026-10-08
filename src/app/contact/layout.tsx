import DynamicCards from "@/components/dynamic-cards";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <DynamicCards pageName="contact" />
      </div>
    </>
  );
}
