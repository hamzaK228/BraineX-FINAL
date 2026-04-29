"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, MapPin, Award, ChevronDown, Filter, Globe, GraduationCap, Coins, FlaskConical, UserCheck, Monitor } from "lucide-react";

type Scholarship = {
  id: string; title: string; provider: string; location: string; 
  coverage: "Full Ride" | "Partial" | "Grant" | "Stipend";
  degreeLevel: string[]; deadline: string; amount: number; tags: string[]; 
  fields: string[]; 
  eligibility: ("International" | "Domestic")[];
  format: "Online" | "Offline" | "Universal";
  description?: string; special_features?: string[]; noticable_facts?: string[];
  apply_link?: string; featured?: boolean;
};

const scholarshipsData: Scholarship[] = [
  {
    id: "s1", title: "The Gates Scholarship", provider: "Gates Foundation", location: "USA", coverage: "Full Ride", degreeLevel: ["Undergraduate"], deadline: "2024-09-15", amount: 200000, tags: ["Full Ride", "Need-Based"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "A highly selective, last-dollar scholarship for outstanding, minority, high school seniors from low-income households.",
    special_features: ["Full cost of attendance", "Leadership training", "Professional development"],
    apply_link: "https://thegatesscholarship.org"
  },
  {
    id: "s2", title: "Rhodes Scholarship", provider: "Rhodes Trust", location: "UK (Oxford)", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2024-10-01", amount: 75000, tags: ["Prestige", "Leadership"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "The oldest and perhaps most prestigious international scholarship program, supporting students at the University of Oxford.",
    special_features: ["Oxford tuition", "Living stipend", "Global alumni network"],
    apply_link: "https://rhodeshouse.ox.ac.uk"
  },
  {
    id: "s3", title: "Fulbright Program", provider: "U.S. Department of State", location: "USA / Global", coverage: "Full Ride", degreeLevel: ["Graduate", "Research"], deadline: "2024-10-11", amount: 50000, tags: ["Cultural Exchange", "Research"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "The flagship international educational exchange program sponsored by the U.S. government.",
    apply_link: "https://fulbrightprogram.org"
  },
  {
    id: "s4", title: "Chevening Scholarships", provider: "UK Government", location: "UK", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2024-11-05", amount: 45000, tags: ["Global Leaders", "Networking"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "The UK government’s international awards program aimed at developing global leaders.",
    apply_link: "https://chevening.org"
  },
  {
    id: "s5", title: "Schwarzman Scholars", provider: "Schwarzman Trust", location: "China", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2024-09-19", amount: 80000, tags: ["Leadership", "Geopolitics"], fields: ["Public Policy", "Economics", "Business"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Designed to prepare the next generation of global leaders to respond to the geopolitical landscape of the 21st Century.",
    apply_link: "https://schwarzmanscholars.org"
  },
  {
    id: "s6", title: "Knight-Hennessy Scholars", provider: "Stanford University", location: "USA", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2024-10-11", amount: 90000, tags: ["Multidisciplinary", "Stanford"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "A multidisciplinary community of graduate students at Stanford University.",
    apply_link: "https://knight-hennessy.stanford.edu"
  },
  {
    id: "s7", title: "DAAD Scholarships", provider: "DAAD Germany", location: "Germany", coverage: "Stipend", degreeLevel: ["Graduate", "PhD"], deadline: "Varies", amount: 15000, tags: ["Germany", "STEM", "Humanities"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Supporting international students to study or conduct research in Germany.",
    apply_link: "https://daad.de"
  },
  {
    id: "s8", title: "Eiffel Excellence Scholarship", provider: "French Government", location: "France", coverage: "Stipend", degreeLevel: ["Master's", "PhD"], deadline: "2025-01-10", amount: 18000, tags: ["France", "Excellence"], fields: ["Law", "Economics", "STEM"], eligibility: ["International"], format: "Offline",
    description: "A tool developed by the Ministry for Europe and Foreign Affairs to enable French higher education institutions to attract top foreign students.",
    apply_link: "https://campusfrance.org"
  },
  {
    id: "s9", title: "MEXT Scholarship", provider: "Japanese Government", location: "Japan", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 20000, tags: ["Japan", "Cultural"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "The Japanese government scholarship program for international students to study in Japan.",
    apply_link: "https://mext.go.jp"
  },
  {
    id: "s10", title: "Erasmus Mundus", provider: "European Union", location: "Europe", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "Varies", amount: 50000, tags: ["Multi-Country", "Diversity"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Joint master's degrees offered by consortia of European universities.",
    apply_link: "https://erasmus-plus.ec.europa.eu"
  },
  {
    id: "s11", title: "Commonwealth Scholarships", provider: "Commonwealth Commission", location: "UK / Global", coverage: "Full Ride", degreeLevel: ["Master's", "PhD"], deadline: "Varies", amount: 40000, tags: ["Commonwealth", "Development"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Scholarships for students from Commonwealth countries to study in the UK or other member states.",
    apply_link: "https://cscuk.fcdo.gov.uk"
  },
  {
    id: "s12", title: "Gates Cambridge Scholarship", provider: "Gates Foundation", location: "UK (Cambridge)", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2024-10-11", amount: 65000, tags: ["Cambridge", "Social Impact"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Full-cost scholarships for postgraduate study in any subject available at the University of Cambridge.",
    apply_link: "https://gatescambridge.org"
  },
  {
    id: "s13", title: "Vanier Canada Graduate", provider: "Canadian Government", location: "Canada", coverage: "Stipend", degreeLevel: ["PhD"], deadline: "2024-11-01", amount: 50000, tags: ["Canada", "PhD"], fields: ["STEM", "Health", "Humanities"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Supporting students who demonstrate both leadership skills and a high standard of scholarly achievement in graduate studies.",
    apply_link: "https://vanier.gc.ca"
  },
  {
    id: "s14", title: "Hubert Humphrey Fellowship", provider: "U.S. State Dept", location: "USA", coverage: "Full Ride", degreeLevel: ["Professional"], deadline: "Varies", amount: 40000, tags: ["Professional", "Leadership"], fields: ["Public Policy", "Health", "Climate"], eligibility: ["International"], format: "Offline",
    description: "Providing 10 months of professional enrichment and non-degree graduate-level study in the U.S.",
    apply_link: "https://humphreyfellowship.org"
  },
  {
    id: "s15", title: "Aga Khan Foundation", provider: "AKDN", location: "Global", coverage: "Partial", degreeLevel: ["Master's", "PhD"], deadline: "2025-03-31", amount: 25000, tags: ["Need-Based", "Development"], fields: ["All"], eligibility: ["International"], format: "Universal",
    description: "Providing a limited number of scholarships each year for postgraduate studies to outstanding students from select developing countries.",
    apply_link: "https://akdn.org"
  },
  {
    id: "s16", title: "ADB-Japan Scholarship", provider: "Asian Development Bank", location: "Asia / Pacific", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "Varies", amount: 30000, tags: ["Asia", "Development"], fields: ["Economics", "STEM", "Health"], eligibility: ["International"], format: "Offline",
    description: "Aimed at providing opportunities for well-qualified citizens of ADB’s developing member countries to undertake postgraduate studies.",
    apply_link: "https://adb.org"
  },
  {
    id: "s17", title: "MasterCard Foundation", provider: "MasterCard Foundation", location: "Global / Africa", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 45000, tags: ["Africa", "Leadership"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Partnering with universities to provide scholarships for high-potential students from Sub-Saharan Africa.",
    apply_link: "https://mastercardfdn.org"
  },
  {
    id: "s18", title: "Joint Japan World Bank", provider: "World Bank", location: "Global", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2025-05-24", amount: 50000, tags: ["Development", "Policy"], fields: ["Social Sciences", "Economics"], eligibility: ["International"], format: "Offline",
    description: "Supporting students from developing countries to study subjects related to development.",
    apply_link: "https://worldbank.org"
  },
  {
    id: "s19", title: "Swiss Government Excellence", provider: "Switzerland Gov", location: "Switzerland", coverage: "Stipend", degreeLevel: ["PhD", "Postgraduate"], deadline: "Varies", amount: 25000, tags: ["Switzerland", "Research"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Enabling foreign researchers from all academic fields to conduct research at a Swiss university.",
    apply_link: "https://sbfi.admin.ch"
  },
  {
    id: "s20", title: "Austrian Government Scholarship", provider: "Austria Gov", location: "Austria", coverage: "Stipend", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 12000, tags: ["Austria", "EU"], fields: ["STEM", "Arts"], eligibility: ["International"], format: "Offline",
    description: "Supporting international students for studies in Austria.",
    apply_link: "https://grants.at"
  },
  {
    id: "s21", title: "Orange Knowledge Program", provider: "Netherlands Gov", location: "Netherlands", coverage: "Full Ride", degreeLevel: ["Short Course", "Master's"], deadline: "Varies", amount: 35000, tags: ["Netherlands", "Growth"], fields: ["Food Security", "Water", "Health"], eligibility: ["International"], format: "Offline",
    description: "Contributing to a society’s sustainable and inclusive development in the Netherlands.",
    apply_link: "https://nuffic.nl"
  },
  {
    id: "s22", title: "Swedish Institute Scholarships", provider: "Sweden Gov", location: "Sweden", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2025-02-15", amount: 40000, tags: ["Sweden", "Sustainability"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Providing opportunities for global professionals to develop their leadership skills.",
    apply_link: "https://si.se"
  },
  {
    id: "s23", title: "GKS (Global Korea Scholarship)", provider: "South Korea Gov", location: "South Korea", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 25000, tags: ["South Korea", "Language"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Designed to provide international students with opportunities to study at higher educational institutions in Korea.",
    apply_link: "https://studyinkorea.go.kr"
  },
  {
    id: "s24", title: "SINGA Scholarship", provider: "A*STAR Singapore", location: "Singapore", coverage: "Full Ride", degreeLevel: ["PhD"], deadline: "2025-06-01", amount: 45000, tags: ["Singapore", "STEM"], fields: ["STEM", "Biomedical"], eligibility: ["International"], format: "Offline",
    description: "Award for international students with excellent academic undergraduate and/or master's results, and strong interest in doing research leading to a PhD.",
    apply_link: "https://a-star.edu.sg"
  },
  {
    id: "s25", title: "Taiwan MOE Scholarship", provider: "Taiwan Government", location: "Taiwan", coverage: "Stipend", degreeLevel: ["Undergraduate", "Graduate"], deadline: "2025-03-31", amount: 15000, tags: ["Taiwan", "Asia"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Encouraging outstanding international students to undertake degree studies in Taiwan.",
    apply_link: "https://edu.tw"
  },
  {
    id: "s26", title: "New Zealand Manaaki", provider: "NZ Government", location: "New Zealand", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "Varies", amount: 40000, tags: ["NZ", "Development"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Scholarships for international students from developing countries to study in New Zealand.",
    apply_link: "https://nzscholarships.govt.nz"
  },
  {
    id: "s27", title: "Australia Awards", provider: "Australia Gov", location: "Australia", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "2024-04-30", amount: 50000, tags: ["Australia", "Leadership"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Long-term awards administered by the Department of Foreign Affairs and Trade.",
    apply_link: "https://dfat.gov.au"
  },
  {
    id: "s28", title: "Stipendium Hungaricum", provider: "Hungary Gov", location: "Hungary", coverage: "Full Ride", degreeLevel: ["All"], deadline: "2025-01-15", amount: 10000, tags: ["Hungary", "Europe"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "The most prestigious higher education scholarship program of the Hungarian Government.",
    apply_link: "https://stipendiumhungaricum.hu"
  },
  {
    id: "s29", title: "Yenching Academy", provider: "Peking University", location: "China", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2024-12-03", amount: 40000, tags: ["China", "Global Affairs"], fields: ["Chinese Studies", "Politics", "Law"], eligibility: ["International"], format: "Offline",
    description: "A fully funded residential program for a Master's in China Studies at Peking University.",
    apply_link: "https://yenchingacademy.pku.edu.cn"
  },
  {
    id: "s30", title: "Lester B. Pearson", provider: "University of Toronto", location: "Canada", coverage: "Full Ride", degreeLevel: ["Undergraduate"], deadline: "2024-11-30", amount: 180000, tags: ["Toronto", "High Prestige"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Recognizing international students who demonstrate exceptional academic achievement and creativity.",
    apply_link: "https://future.utoronto.ca"
  },
  {
    id: "s31", title: "President's Scholarship", provider: "Imperial College", location: "UK", coverage: "Full Ride", degreeLevel: ["PhD"], deadline: "Varies", amount: 60000, tags: ["Imperial", "STEM"], fields: ["STEM", "Medicine", "Business"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Rewarding students of any nationality who demonstrate the highest potential for doctoral research.",
    apply_link: "https://imperial.ac.uk"
  },
  {
    id: "s32", title: "Clarendon Scholarship", provider: "Oxford University", location: "UK", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2025-01-20", amount: 70000, tags: ["Oxford", "Merit"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Supporting more than 160 graduate students at the University of Oxford every year.",
    apply_link: "https://ox.ac.uk/clarendon"
  },
  {
    id: "s33", title: "Gates Millenium", provider: "Gates Foundation", location: "USA", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 150000, tags: ["USA", "Minority"], fields: ["STEM", "Education", "Health"], eligibility: ["Domestic"], format: "Universal",
    description: "Reducing financial barriers for African American, American Indian, Asian Pacific Islander, and Hispanic American students.",
    apply_link: "https://gmsp.org"
  },
  {
    id: "s34", title: "Jack Kent Cooke", provider: "JKC Foundation", location: "USA", coverage: "Partial", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 40000, tags: ["USA", "Need-Based"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "Dedicated to advancing the education of exceptionally promising students who have financial need.",
    apply_link: "https://jkcf.org"
  },
  {
    id: "s35", title: "Coca-Cola Scholars", provider: "Coca-Cola Co.", location: "USA", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "2024-10-31", amount: 20000, tags: ["USA", "High School"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "Achievement-based scholarship awarded to graduating high school seniors.",
    apply_link: "https://coca-colascholarsfoundation.org"
  },
  {
    id: "s36", title: "National Merit", provider: "NMSC", location: "USA", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "Varies", amount: 2500, tags: ["USA", "PSAT"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "A prestigious academic competition for recognition and scholarships.",
    apply_link: "https://nationalmerit.org"
  },
  {
    id: "s37", title: "Truman Scholarship", provider: "Truman Foundation", location: "USA", coverage: "Grant", degreeLevel: ["Graduate"], deadline: "2025-02-04", amount: 30000, tags: ["Public Service", "USA"], fields: ["Public Policy", "Humanities"], eligibility: ["Domestic"], format: "Universal",
    description: "For juniors in college who show exceptional leadership potential and are committed to careers in public service.",
    apply_link: "https://truman.gov"
  },
  {
    id: "s38", title: "Goldwater Scholarship", provider: "Goldwater Foundation", location: "USA", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "2025-01-31", amount: 7500, tags: ["STEM", "Research", "USA"], fields: ["STEM"], eligibility: ["Domestic"], format: "Universal",
    description: "For students pursuing careers in the natural sciences, mathematics, and engineering.",
    apply_link: "https://goldwater.scholarsapply.org"
  },
  {
    id: "s39", title: "Udall Scholarship", provider: "Udall Foundation", location: "USA", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "2025-03-05", amount: 7000, tags: ["Environment", "Native American"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "For students who demonstrate leadership and commitment to issues related to Native American nations or the environment.",
    apply_link: "https://udall.gov"
  },
  {
    id: "s40", title: "Mitchell Scholarship", provider: "US-Ireland Alliance", location: "Ireland", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2024-09-27", amount: 40000, tags: ["Ireland", "Exchange"], fields: ["All"], eligibility: ["Domestic"], format: "Offline",
    description: "Postgraduate study in Ireland and Northern Ireland.",
    apply_link: "https://us-irelandalliance.org"
  },
  {
    id: "s41", title: "Aga Khan (Small Grants)", provider: "AKF", location: "Central Asia", coverage: "Grant", degreeLevel: ["All"], deadline: "Rolling", amount: 5000, tags: ["Tajikistan", "Kyrgyzstan"], fields: ["Education", "Agri"], eligibility: ["International"], format: "Universal",
    description: "Supporting localized educational initiatives in the mountain regions of Central Asia.",
    apply_link: "https://akdn.org"
  },
  {
    id: "s42", title: "Friedrich Ebert Foundation", provider: "FES Germany", location: "Germany", coverage: "Stipend", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 15000, tags: ["Social Democracy", "Germany"], fields: ["Social Sciences", "Humanities", "Politics"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Supporting students with outstanding academic records who wish to contribute to social democracy.",
    apply_link: "https://fes.de"
  },
  {
    id: "s43", title: "Future Global Leaders", provider: "Hult Prize", location: "Global", coverage: "Grant", degreeLevel: ["Graduate"], deadline: "Varies", amount: 1000000, tags: ["Social Enterprise", "Grand Prize"], fields: ["Business", "Interdisciplinary"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "A global competition that challenges university students to solve the world’s most pressing issues.",
    apply_link: "https://hultprize.org"
  },
  {
    id: "s44", title: "Turing Award Research", provider: "ACM", location: "Global", coverage: "Grant", degreeLevel: ["PhD", "Research"], deadline: "Varies", amount: 1000000, tags: ["CS", "Research"], fields: ["STEM"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "Research grants associated with the highest distinction in computer science.",
    apply_link: "https://amturing.acm.org"
  },
  {
    id: "s45", title: "Presidential Scholarship", provider: "Various Unis", location: "Global", coverage: "Full Ride", degreeLevel: ["Undergraduate"], deadline: "Varies", amount: 200000, tags: ["Merit-Based", "Full Ride"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "Generic entry for university-specific presidential awards for top-scoring international students.",
    apply_link: "https://www.commonapp.org"
  },
  {
    id: "s46", title: "L'Oréal-UNESCO For Women", provider: "L'Oréal / UNESCO", location: "Global", coverage: "Stipend", degreeLevel: ["PhD", "Research"], deadline: "Varies", amount: 15000, tags: ["Women in Science", "Research"], fields: ["STEM", "Health"], eligibility: ["International"], format: "Offline",
    description: "Supporting outstanding women researchers who contribute to the progress of science.",
    apply_link: "https://forwomeninscience.com"
  },
  {
    id: "s47", title: "Boeing STEM Award", provider: "Boeing Co.", location: "USA / Global", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "Varies", amount: 10000, tags: ["Aerospace", "STEM"], fields: ["STEM"], eligibility: ["Domestic", "International"], format: "Universal",
    description: "Grants for students studying aerospace and mechanical engineering.",
    apply_link: "https://boeing.com"
  },
  {
    id: "s48", title: "Google PhD Fellowship", provider: "Google", location: "Global", coverage: "Stipend", degreeLevel: ["PhD"], deadline: "2024-09-30", amount: 50000, tags: ["CS", "Research"], fields: ["STEM"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "Supporting graduate students doing exceptional work in computer science and related disciplines.",
    apply_link: "https://research.google/outreach/phd-fellowship"
  },
  {
    id: "s49", title: "Open Society Foundations", provider: "OSF", location: "Global", coverage: "Grant", degreeLevel: ["All"], deadline: "Rolling", amount: 20000, tags: ["Human Rights", "Policy"], fields: ["Humanities", "Law"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "Grants for individuals working on projects that promote democratic values.",
    apply_link: "https://opensocietyfoundations.org"
  },
  {
    id: "s50", title: "Heinrich Böll Scholarships", provider: "Heinrich Böll Foundation", location: "Germany", coverage: "Stipend", degreeLevel: ["Graduate", "PhD"], deadline: "2025-03-01", amount: 18000, tags: ["Green Politics", "Sustainability"], fields: ["STEM", "Social Sciences", "Arts"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Awarding scholarships to international students who gain their university entrance qualification from a school outside Germany.",
    apply_link: "https://boell.de"
  }
];

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [sort, setSort] = useState("amount_desc");
  const [selectedSchol, setSelectedSchol] = useState<Scholarship | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [location, setLocation] = useState("Any Location");
  const [coverage, setCoverage] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [activeFields, setActiveFields] = useState<string[]>([]);
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState<string[]>([]);
  const [activeTesting, setActiveTesting] = useState<string[]>([]);
  const [activeAidType, setActiveAidType] = useState<string[]>([]);

  const locations = useMemo(() => ["Any Location", ...Array.from(new Set(scholarshipsData.map(s => s.location))).sort()], []);
  const fieldOptions = ["STEM", "Medicine", "Business", "Humanities", "Arts", "Social Sciences", "Law", "Education", "Leadership", "Environment"];
  const levelOptions = ["High School", "Undergraduate", "Master's", "Ph.D.", "Postgraduate"];
  const coverageOptions = ["Full Ride", "Partial", "Grant", "Stipend"];
  const formatOptions = ["Online", "Offline", "Universal"];
  const eligibilityOptions = ["International", "Domestic"];
  const statusOptions = ["Open Now", "Closing Soon", "Opening Soon"];
  const testingOptions = ["No Tests Needed", "IELTS Required", "SAT Required"];
  const aidTypeOptions = ["Merit-Based", "Need-Based", "Talent-Based"];

  const tog = (arr: string[], val: string, set: React.Dispatch<React.SetStateAction<string[]>>) => {
    set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const filtered = useMemo(() => {
    let r = scholarshipsData;
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(x => x.title.toLowerCase().includes(s) || x.provider.toLowerCase().includes(s) || x.tags.some(t => t.toLowerCase().includes(s)));
    }
    if (location !== "Any Location") r = r.filter(x => x.location === location);
    if (coverage.length > 0) r = r.filter(x => coverage.includes(x.coverage));
    if (levels.length > 0) r = r.filter(x => levels.some(l => x.degreeLevel.includes(l)));
    if (activeFields.length > 0) r = r.filter(x => activeFields.some(f => x.fields.includes(f)));
    if (eligibility.length > 0) r = r.filter(x => eligibility.some(e => x.eligibility.includes(e as any)));
    if (formats.length > 0) r = r.filter(x => formats.includes(x.format));

    return [...r].sort((a, b) => {
      if (sort === "amount_desc") return b.amount - a.amount;
      if (sort === "amount_asc") return a.amount - b.amount;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [search, location, coverage, levels, activeFields, eligibility, formats, sort]);

  const activeFiltersCount = (location !== "Any Location" ? 1 : 0) + coverage.length + levels.length + activeFields.length + eligibility.length + formats.length + activeStatus.length + activeTesting.length + activeAidType.length;

  return (
    <>
      <PublicHeader />
      {selectedSchol && (
        <InfoModal
          isOpen={!!selectedSchol}
          onClose={() => setSelectedSchol(null)}
          title={selectedSchol.title}
          subtitle={selectedSchol.provider}
          icon="💰"
          image="https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1200"
          description={selectedSchol.description}
          specialFeatures={selectedSchol.special_features}
          stats={[
            { label: "Coverage", value: selectedSchol.coverage },
            { label: "Format", value: selectedSchol.format },
            { label: "Est. Value", value: `~$${selectedSchol.amount.toLocaleString()}` }
          ]}
          tips={selectedSchol.noticable_facts || ["Start at least 6 months early.", "Get high quality recommendation letters."]}
          ctaLink={selectedSchol.apply_link}
          ctaLabel="Apply Now"
        />
      )}

      <main id="mainContent" style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg-color)" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: "1rem", fontWeight: 800 }}>Global Scholarships</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 500 }}>
              Filter through {scholarshipsData.length} prestigious scholarships mapped from the BraineX Master Resource Guide.
            </motion.p>
            
            <div className={styles.searchBox}>
              <Search style={{ color: "#10b981", opacity: 0.5 }} size={20} />
              <input 
                type="text" 
                placeholder="Search scholarships by provider, country, or major..." 
                className={styles.searchInput} 
                value={tempSearch} 
                onChange={e => setTempSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && setSearch(tempSearch)}
              />
              <button className={styles.searchBtn} onClick={() => setSearch(tempSearch)}>Search</button>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--bg-color)" }}>
          <div className={`container ${styles.layout}`}>
            
            <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
              <div className={styles.filterBar} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <div className={styles.filterBarLeft}>
                  <Filter size={18} style={{ color: "#10b981" }} />
                  <span className={styles.filterBarTitle}>
                    Filter {activeFiltersCount > 0 && <span className={styles.filterCount} style={{ background: "#10b981" }}>{activeFiltersCount}</span>}
                  </span>
                </div>
                <ChevronDown size={20} style={{ transform: isFilterOpen ? "rotate(180deg)" : "none", transition: "0.3s", color: "var(--text-muted)" }} />
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                    <div className={styles.expandedFilters}>
                      
                      <div>
                        <span className={styles.filterSectionTitle}><FlaskConical size={12} /> Field of Study</span>
                        <div className={styles.checkGrid}>
                          {fieldOptions.map(f => (
                            <label key={f} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeFields.includes(f)} onChange={() => tog(activeFields, f, setActiveFields)} />
                              {f}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Monitor size={12} /> Study Format</span>
                        <div className={styles.checkGrid}>
                          {formatOptions.map(f => (
                            <label key={f} className={styles.checkLabel}>
                              <input type="checkbox" checked={formats.includes(f)} onChange={() => tog(formats, f, setFormats)} />
                              {f}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><GraduationCap size={12} /> Degree Level</span>
                          <div className={styles.checkGrid}>
                            {levelOptions.map(l => (
                              <label key={l} className={styles.checkLabel}>
                                <input type="checkbox" checked={levels.includes(l)} onChange={() => tog(levels, l, setLevels)} />
                                {l}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><UserCheck size={12} /> Eligibility</span>
                        <div className={styles.checkGrid}>
                          {eligibilityOptions.map(e => (
                            <label key={e} className={styles.checkLabel}>
                              <input type="checkbox" checked={eligibility.includes(e)} onChange={() => tog(eligibility, e, setEligibility)} />
                              {e} Students
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Globe size={12} /> Region</span>
                          <select className={styles.filterSelect} value={location} onChange={e => setLocation(e.target.value)}>
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Coins size={12} /> Coverage Type</span>
                        <div className={styles.checkGrid}>
                          {coverageOptions.map(c => (
                            <label key={c} className={styles.checkLabel}>
                              <input type="checkbox" checked={coverage.includes(c)} onChange={() => tog(coverage, c, setCoverage)} />
                              {c}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Monitor size={12} /> Application Status</span>
                          <div className={styles.checkGrid}>
                            {statusOptions.map(s => (
                              <label key={s} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeStatus.includes(s)} onChange={() => tog(activeStatus, s, setActiveStatus)} />
                                {s}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><FlaskConical size={12} /> Requirements & Type</span>
                        <div className={styles.checkGrid}>
                          {testingOptions.map(t => (
                            <label key={t} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeTesting.includes(t)} onChange={() => tog(activeTesting, t, setActiveTesting)} />
                              {t}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Award size={12} /> Aid Category</span>
                          <div className={styles.checkGrid}>
                            {aidTypeOptions.map(a => (
                              <label key={a} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeAidType.includes(a)} onChange={() => tog(activeAidType, a, setActiveAidType)} />
                                {a}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.controlsRow}>
                <span className={styles.resultsText}>Showing <strong>{filtered.length}</strong> Scholarships</span>
                <div className={styles.sortWrapper}>
                  <span className={styles.sortLabel}>Sort by:</span>
                  <select className={styles.filterSelect} style={{ width: "auto", padding: "0.4rem 1rem" }} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="amount_desc">💰 Highest Value</option>
                    <option value="amount_asc">💰 Lowest Value</option>
                    <option value="name_asc">📝 Name A→Z</option>
                  </select>
                </div>
              </div>

              <div className={styles.grid} style={{ marginTop: "2rem" }}>
                <AnimatePresence>
                  {filtered.map((schol, index) => (
                    <motion.div key={schol.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                          <img 
                            src={"https://www.google.com/s2/favicons?domain=" + schol.provider.toLowerCase().replace(/ /g, "") + ".com&sz=128"} 
                            alt={schol.provider} 
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            onError={(e) => { 
                              e.currentTarget.onerror = null; 
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 15l-2 5L9 9l11 4-5 2zm0 0l4 4'/%3E%3C/svg%3E";
                            }} 
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 className={styles.title}>{schol.title}</h3>
                          <div className={styles.provider}>{schol.provider}</div>
                          <div className={styles.locationRow}><MapPin size={14} />Study in: {schol.location}</div>
                        </div>
                      </div>

                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>COVERAGE</span>
                          <span className={`${styles.detailValue} ${styles.coverageValue}`}>{schol.coverage}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>FORMAT</span>
                          <span className={styles.detailValue}>{schol.format}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>ELIGIBILITY</span>
                          <span className={styles.detailValue}>{schol.eligibility.length === 2 ? "Universal" : schol.eligibility[0]}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>EST. VALUE</span>
                          <span className={styles.detailValue}>~${schol.amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className={styles.tags}>
                        {schol.tags.slice(0, 3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                      </div>

                      <button className={styles.viewApplyBtn} onClick={() => setSelectedSchol(schol)}>
                        View & Apply
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}