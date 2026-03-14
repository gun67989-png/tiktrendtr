import { getLandingContent } from "@/lib/landing-content";
import LandingPage from "@/components/landing/LandingPage";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  const content = await getLandingContent();
  return <LandingPage content={content} />;
}
