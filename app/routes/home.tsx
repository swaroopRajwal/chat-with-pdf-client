import HomePageLayout from "@layouts/homePageLayout";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Files" },
    { name: "description", content: "View all available PDFs to chat with" },
  ];
}

export default function Home() {
  return <HomePageLayout />;
}
