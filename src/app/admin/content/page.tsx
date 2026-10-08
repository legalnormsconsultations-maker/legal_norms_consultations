import { getPageContents } from "@/actions/page-content-actions";
import PageContentManager from "./page-content-manager";

export const metadata = {
  title: "Content Management | Admin",
};

export default async function AdminContentPage() {
  const contents = await getPageContents();

  return (
    <PageContentManager initialData={contents} />
  );
}
