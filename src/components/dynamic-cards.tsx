import { getPageContents } from "@/actions/page-content-actions";
import DynamicCardsClient from "./dynamic-cards-client";

export default async function DynamicCards({ pageName }: { pageName: string }) {
  const contents = await getPageContents(pageName);
  
  const activeContents = contents.filter(c => c.isActive);

  if (activeContents.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <DynamicCardsClient contents={activeContents} />
    </div>
  );
}
