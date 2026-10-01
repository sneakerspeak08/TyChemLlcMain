import HomePage from "@/views/HomePage";
import { getProducts } from "@/lib/products";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });

export default async function Page() {
  return <HomePage products={await getProducts()} />;
}
