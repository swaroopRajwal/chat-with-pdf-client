import HomePageLayout from "@layouts/homePageLayout";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Books" },
    { name: "description", content: "View all available books to talk with" },
  ];
}

export default function Home() {
  return <HomePageLayout />;
}
