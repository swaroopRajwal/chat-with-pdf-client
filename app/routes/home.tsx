import HomePageLayout from "@layouts/home";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home page" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <HomePageLayout />;
}
