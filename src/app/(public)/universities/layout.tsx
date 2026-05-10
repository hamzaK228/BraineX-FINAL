import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Universities | BraineX",
  description: "Explore and compare the world's best universities. Find your perfect academic home with our extensive database and AI-powered Deep Search.",
  keywords: ["top universities", "college search", "global universities", "university rankings", "BraineX universities"],
  openGraph: {
    title: "Top Universities | BraineX",
    description: "Explore and compare the world's best universities. Find your perfect academic home.",
  },
};

export default function UniversitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
