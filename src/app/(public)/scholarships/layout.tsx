import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Scholarships | BraineX",
  description: "Filter through prestigious scholarships mapped from the BraineX Master Resource Guide. Discover full rides, partial grants, and more.",
  keywords: ["scholarships", "global scholarships", "full ride scholarships", "college funding", "BraineX scholarships"],
  openGraph: {
    title: "Global Scholarships | BraineX",
    description: "Filter through prestigious scholarships mapped from the BraineX Master Resource Guide.",
  },
};

export default function ScholarshipsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
