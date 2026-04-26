import { PublicHeader } from "@/components/PublicHeader";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicHeader />
      <div style={{ marginTop: "0" }}>
        {children}
      </div>
    </>
  );
}
