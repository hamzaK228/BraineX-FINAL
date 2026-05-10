import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { MapPin, GraduationCap, Users, BookOpen, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

async function getUniversity(id: string) {
  try {
    const university = await prisma.contentUniversity.findUnique({
      where: { id }
    });
    return university;
  } catch (error) {
    console.error("Failed to fetch university:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const university = await getUniversity(params.id);

  if (!university) {
    return { title: "University Not Found | BraineX" };
  }

  const title = `${university.name} | BraineX Universities`;
  const description = university.description || `Explore ${university.name} located in ${university.location}, ${university.country}. Find rankings, tuition, and acceptance rates on BraineX.`;
  const defaultImage = "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://braine-x.com/universities/${university.id}`,
      images: [{ url: university.image || defaultImage, width: 1200, height: 630, alt: university.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [university.image || defaultImage],
    },
    alternates: {
      canonical: `https://braine-x.com/universities/${university.id}`,
    }
  };
}

export default async function UniversityPage({ params }: { params: { id: string } }) {
  const university = await getUniversity(params.id);

  if (!university) {
    notFound();
  }

  const defaultImage = "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop";
  const displayImage = university.image || defaultImage;
  const displayLogo = university.logo || `https://www.google.com/s2/favicons?domain=${university.name.toLowerCase().replace(/\s+/g,'')}.edu&sz=128`;

  // JSON-LD Structured Data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": university.name,
    "url": university.website || `https://braine-x.com/universities/${university.id}`,
    "logo": displayLogo,
    "image": displayImage,
    "description": university.description || `${university.name} is a university in ${university.location}, ${university.country}.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": university.location,
      "addressCountry": university.country
    }
  };

  return (
    <>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <main style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg-color)" }}>
        {/* Hero Section */}
        <div style={{ position: "relative", height: "40vh", minHeight: "350px", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${displayImage})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.5)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to top, var(--bg-color), transparent)", zIndex: 1 }} />
          
          <div className="container" style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "3rem" }}>
            <Link href="/universities" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)", textDecoration: "none", marginBottom: "2rem", fontWeight: "600", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}>
              <ArrowLeft size={20} /> Back to Universities
            </Link>
            
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "20px", background: "#fff", padding: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                <img src={displayLogo} alt={`${university.name} logo`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.5rem 0", lineHeight: 1.1 }}>{university.name}</h1>
                <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MapPin size={18} /> {university.location}, {university.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container" style={{ padding: "3rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
            
            {/* Main Details */}
            <div style={{ gridColumn: "1 / -2" }}>
              <div style={{ background: "var(--card-bg)", borderRadius: "24px", padding: "2.5rem", border: "1px solid var(--card-border)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0 0 1.5rem 0", color: "var(--text-color)" }}>About</h2>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--text-muted)", margin: 0 }}>
                  {university.description || `${university.name} is a premier academic institution located in ${university.location}, ${university.country}.`}
                </p>

                {university.specialFeatures && university.specialFeatures.length > 0 && (
                  <>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "2rem 0 1rem 0", color: "var(--text-color)" }}>Special Features</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
                      {university.specialFeatures.map((feature, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                          <span style={{ color: "#3b82f6", marginTop: "2px" }}>✨</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {university.noticableFacts && university.noticableFacts.length > 0 && (
                  <>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "2rem 0 1rem 0", color: "var(--text-color)" }}>Noticable Facts</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
                      {university.noticableFacts.map((fact, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                          <span style={{ color: "#10b981", marginTop: "2px" }}>📌</span> {fact}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(59,130,246,0.2)" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 1.5rem 0", color: "var(--text-color)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BookOpen size={20} color="#3b82f6" /> Quick Stats
                </h3>
                
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem" }}>World Ranking</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-color)" }}>#{university.ranking || "N/A"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem" }}>Acceptance Rate</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-color)" }}>{university.acceptance != null ? `${university.acceptance}%` : "N/A"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem" }}>Tuition</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-color)" }}>{university.tuition == null ? "N/A" : university.tuition === 0 ? "Free" : `$${university.tuition.toLocaleString()}`}</div>
                  </div>
                </div>
              </div>

              {university.website && (
                <a 
                  href={university.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "1.25rem", background: "var(--card-bg)", color: "var(--text-color)", border: "1px solid var(--card-border)", borderRadius: "16px", textDecoration: "none", fontWeight: 600, fontSize: "1.05rem", transition: "all 0.2s" }}
                  onMouseOver={e => { e.currentTarget.style.background = "var(--card-border)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "var(--card-bg)"; }}
                >
                  Visit Official Website <ExternalLink size={18} />
                </a>
              )}
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
