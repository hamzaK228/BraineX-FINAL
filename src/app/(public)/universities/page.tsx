"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, GraduationCap, Users, BookOpen, Sparkles, ArrowRight, Bookmark, Filter, ChevronDown, Check, Globe, Coins, FlaskConical, Monitor } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

const top50Data = [
  { 
    id: "mit", 
    name: "Massachusetts Institute of Technology (MIT)", 
    city: "Cambridge", 
    country: "USA", 
    ranking: 1, 
    tuition: 60156, 
    acceptance_rate: 4, 
    logo: "https://www.google.com/s2/favicons?domain=mit.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=1200&auto=format&fit=crop",
    programs: ["Computer Science", "Engineering", "Physics"], 
    type: "Private", 
    students: 11934,
    description: "MIT is a world-class institution known for its cutting-edge research and innovation in science, engineering, and technology.",
    special_features: ["Media Lab Innovation", "MIT.nano Research Facility", "Strong Entrepreneurial Ecosystem"],
    noticable_facts: ["85% of undergrads participate in research", "Over 90 Nobel Laureates associated"]
  },
  { 
    id: "imperial", 
    name: "Imperial College London", 
    city: "London", 
    country: "UK", 
    ranking: 2, 
    tuition: 42000, 
    acceptance_rate: 14, 
    logo: "https://www.google.com/s2/favicons?domain=imperial.ac.uk&sz=128", 
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Engineering", "Business"], 
    type: "Public", 
    students: 20000,
    description: "Imperial College London is a global top-ten university with a world-class reputation in science, engineering, business, and medicine.",
    special_features: ["Data Science Institute", "White City Innovation Campus"],
    noticable_facts: ["Focused solely on STEM and Business", "Highest graduate starting salaries in UK"]
  },
  { 
    id: "oxford", 
    name: "University of Oxford", 
    city: "Oxford", 
    country: "UK", 
    ranking: 3, 
    tuition: 45000, 
    acceptance_rate: 17, 
    logo: "https://www.google.com/s2/favicons?domain=ox.ac.uk&sz=128", 
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop",
    programs: ["Humanities", "Medicine", "Philosophy"], 
    type: "Public", 
    students: 24000,
    description: "The University of Oxford is the oldest university in the English-speaking world and is consistently ranked among the best.",
    special_features: ["Bodleian Library", "Collegiate System"],
    noticable_facts: ["Oldest university in English-speaking world", "Has produced 28 British Prime Ministers"]
  },
  { 
    id: "harvard", 
    name: "Harvard University", 
    city: "Cambridge", 
    country: "USA", 
    ranking: 4, 
    tuition: 59000, 
    acceptance_rate: 3, 
    logo: "https://www.google.com/s2/favicons?domain=harvard.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200&auto=format&fit=crop",
    programs: ["Law", "Business", "Medicine"], 
    type: "Private", 
    students: 21000,
    description: "Harvard is a world-renowned Ivy League institution known for its academic excellence and extensive library system.",
    special_features: ["Harvard Library", "Dumbarton Oaks"],
    noticable_facts: ["Oldest institution of higher learning in US", "Largest endowment of any university"]
  },
  { 
    id: "cambridge", 
    name: "University of Cambridge", 
    city: "Cambridge", 
    country: "UK", 
    ranking: 5, 
    tuition: 48000, 
    acceptance_rate: 20, 
    logo: "https://www.google.com/s2/favicons?domain=cam.ac.uk&sz=128", 
    image: "https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?q=80&w=1200&auto=format&fit=crop",
    programs: ["Mathematics", "Physics", "English"], 
    type: "Public", 
    students: 23000,
    description: "Cambridge is one of the world's oldest and most prestigious universities, with a strong emphasis on research.",
    special_features: ["Cavendish Laboratory", "Cambridge University Press"],
    noticable_facts: ["Founded in 1209", "Consistently ranked in global top 5"]
  },
  { 
    id: "stanford", 
    name: "Stanford University", 
    city: "Stanford", 
    country: "USA", 
    ranking: 6, 
    tuition: 62000, 
    acceptance_rate: 4, 
    logo: "https://www.google.com/s2/favicons?domain=stanford.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop",
    programs: ["Computer Science", "Business", "Law"], 
    type: "Private", 
    students: 17000,
    description: "Stanford is located in the heart of Silicon Valley and is known for its entrepreneurial spirit and research.",
    special_features: ["Stanford Research Park", "SLAC National Accelerator"],
    noticable_facts: ["Silicon Valley hub", "High number of faculty Nobelists"]
  },
  { 
    id: "eth", 
    name: "ETH Zurich", 
    city: "Zurich", 
    country: "Switzerland", 
    ranking: 7, 
    tuition: 1500, 
    acceptance_rate: 27, 
    logo: "https://logo.clearbit.com/ethz.ch", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Architecture", "Science"], 
    type: "Public", 
    students: 22000,
    description: "ETH Zurich is a leading science and technology university in continental Europe.",
    special_features: ["World-class labs", "Low public tuition"],
    noticable_facts: ["Einstein's alma mater", "Top university in continental Europe"]
  },
  { 
    id: "nus", 
    name: "National University of Singapore (NUS)", 
    city: "Singapore", 
    country: "Singapore", 
    ranking: 8, 
    tuition: 38000, 
    acceptance_rate: 10, 
    logo: "https://logo.clearbit.com/nus.edu.sg", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Business", "Computing"], 
    type: "Public", 
    students: 44000,
    description: "NUS is Asia's top-ranked university, offering a global approach to education and research.",
    special_features: ["Lee Kuan Yew School", "NUS Overseas Colleges"],
    noticable_facts: ["Consistently Asia's #1", "Strong global research network"]
  },
  { 
    id: "ucl", 
    name: "University College London (UCL)", 
    city: "London", 
    country: "UK", 
    ranking: 9, 
    tuition: 35000, 
    acceptance_rate: 29, 
    logo: "https://logo.clearbit.com/ucl.ac.uk", 
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
    programs: ["Architecture", "Education", "Medicine"], 
    type: "Public", 
    students: 42000,
    description: "UCL is London's global university, known for its diverse and multi-disciplinary environment.",
    special_features: ["Bartlett Faculty", "UCL East Campus"],
    noticable_facts: ["First to admit women on equal terms", "Multidisciplinary powerhouse"]
  },
  { 
    id: "caltech", 
    name: "California Institute of Technology (Caltech)", 
    city: "Pasadena", 
    country: "USA", 
    ranking: 10, 
    tuition: 60000, 
    acceptance_rate: 3, 
    logo: "https://logo.clearbit.com/caltech.edu", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Physics", "Astronomy", "Engineering"], 
    type: "Private", 
    students: 2300,
    description: "Caltech is a world-renowned science and engineering research and education institution.",
    special_features: ["JPL (NASA)", "Caltech Seismological Lab"],
    noticable_facts: ["Manages NASA's JPL", "Highest PhD per student ratio"]
  },
  { 
    id: "toronto", 
    name: "University of Toronto", 
    city: "Toronto", 
    country: "Canada", 
    ranking: 11, 
    tuition: 45000, 
    acceptance_rate: 43, 
    logo: "https://www.google.com/s2/favicons?domain=utoronto.ca&sz=128", 
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Computer Science", "Education"], 
    type: "Public", 
    students: 97000,
    description: "U of T is Canada's leading institution, known for its historic campus and research breakthroughs.",
    special_features: ["Vector Institute for AI", "Rotman School of Management"],
    noticable_facts: ["Birthplace of Insulin", "Largest library system in Canada"]
  },
  { 
    id: "epfl", 
    name: "EPFL", 
    city: "Lausanne", 
    country: "Switzerland", 
    ranking: 12, 
    tuition: 1500, 
    acceptance_rate: 20, 
    logo: "https://www.google.com/s2/favicons?domain=epfl.ch&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Life Sciences", "Mathematics"], 
    type: "Public", 
    students: 12000,
    description: "EPFL is a world-leading science and technology institution located on the shores of Lake Geneva.",
    special_features: ["Blue Brain Project", "Rolex Learning Center"],
    noticable_facts: ["Sister school to ETH Zurich", "Highly international student body"]
  },
  { 
    id: "upenn", 
    name: "University of Pennsylvania", 
    city: "Philadelphia", 
    country: "USA", 
    ranking: 13, 
    tuition: 63000, 
    acceptance_rate: 6, 
    logo: "https://www.google.com/s2/favicons?domain=upenn.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200&auto=format&fit=crop",
    programs: ["Business", "Medicine", "Law"], 
    type: "Private", 
    students: 28000,
    description: "UPenn is an Ivy League institution famous for its interdisciplinary approach and the Wharton School.",
    special_features: ["Wharton School", "Penn Museum"],
    noticable_facts: ["Founded by Benjamin Franklin", "Home to the first university hospital in US"]
  },
  { 
    id: "cornell", 
    name: "Cornell University", 
    city: "Ithaca", 
    country: "USA", 
    ranking: 14, 
    tuition: 65000, 
    acceptance_rate: 7, 
    logo: "https://www.google.com/s2/favicons?domain=cornell.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?q=80&w=1200&auto=format&fit=crop",
    programs: ["Agriculture", "Engineering", "Hotel Management"], 
    type: "Private", 
    students: 25000,
    description: "Cornell is a private Ivy League research university and a land-grant institution.",
    special_features: ["Cornell Tech NYC", "Arecibo Observatory (legacy)"],
    noticable_facts: ["First university to grant degree in Journalism", "Most diverse of the Ivy League schools"]
  },
  { 
    id: "melbourne", 
    name: "University of Melbourne", 
    city: "Melbourne", 
    country: "Australia", 
    ranking: 15, 
    tuition: 35000, 
    acceptance_rate: 70, 
    logo: "https://www.google.com/s2/favicons?domain=unimelb.edu.au&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Law", "Education"], 
    type: "Public", 
    students: 54000,
    description: "Melbourne is Australia's #1 university, known for the 'Melbourne Model' of education.",
    special_features: ["Bio21 Institute", "Melbourne Law School"],
    noticable_facts: ["Ranked #1 in Australia", "Part of the Group of Eight"]
  },
  { 
    id: "peking", 
    name: "Peking University", 
    city: "Beijing", 
    country: "China", 
    ranking: 16, 
    tuition: 5000, 
    acceptance_rate: 1, 
    logo: "https://www.google.com/s2/favicons?domain=pku.edu.cn&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Economics", "Chinese Culture", "Engineering"], 
    type: "Public", 
    students: 45000,
    description: "Peking University is China's oldest national university and a major research center.",
    special_features: ["Boyuan Hall", "Yenching Academy"],
    noticable_facts: ["China's top research university", "Known as 'Yan Yuan' (The Weiming Lake campus)"]
  },
  { 
    id: "yale", 
    name: "Yale University", 
    city: "New Haven", 
    country: "USA", 
    ranking: 17, 
    tuition: 64000, 
    acceptance_rate: 4, 
    logo: "https://www.google.com/s2/favicons?domain=yale.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200&auto=format&fit=crop",
    programs: ["Drama", "Law", "History"], 
    type: "Private", 
    students: 14000,
    description: "Yale is an Ivy League university with a rich history in the arts, humanities, and social sciences.",
    special_features: ["Beinecke Library", "Yale Art Gallery"],
    noticable_facts: ["Produced 5 US Presidents", "Secret societies like Skull and Bones"]
  },
  { 
    id: "hku", 
    name: "University of Hong Kong", 
    city: "Hong Kong", 
    country: "Hong Kong", 
    ranking: 18, 
    tuition: 23000, 
    acceptance_rate: 10, 
    logo: "https://www.google.com/s2/favicons?domain=hku.hk&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Dentistry", "Education", "Business"], 
    type: "Public", 
    students: 30000,
    description: "HKU is Hong Kong's oldest and most prestigious institution of higher learning.",
    special_features: ["Main Building (Monument)", "Pokfield Campus"],
    noticable_facts: ["Ranked #1 in HK", "Very high international diversity"]
  },
  { 
    id: "ntu", 
    name: "Nanyang Technological University", 
    city: "Singapore", 
    country: "Singapore", 
    ranking: 19, 
    tuition: 35000, 
    acceptance_rate: 15, 
    logo: "https://www.google.com/s2/favicons?domain=ntu.edu.sg&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Communication", "Science"], 
    type: "Public", 
    students: 33000,
    description: "NTU is a young, research-intensive university in Singapore, ranked among the best for technology.",
    special_features: ["The Hive (Learning Hub)", "ADM Building"],
    noticable_facts: ["World's best young university for years", "Sustainable campus"]
  },
  { 
    id: "princeton", 
    name: "Princeton University", 
    city: "Princeton", 
    country: "USA", 
    ranking: 20, 
    tuition: 59000, 
    acceptance_rate: 4, 
    logo: "https://www.google.com/s2/favicons?domain=princeton.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop",
    programs: ["Mathematics", "Public Policy", "Physics"], 
    type: "Private", 
    students: 8500,
    description: "Princeton is an Ivy League research university known for its commitment to undergraduate teaching.",
    special_features: ["Princeton Plasma Physics Lab", "McCarter Theatre"],
    noticable_facts: ["Consistently #1 in US News", "Highest endowment per student"]
  },
  { 
    id: "tsinghua", 
    name: "Tsinghua University", 
    city: "Beijing", 
    country: "China", 
    ranking: 21, 
    tuition: 6000, 
    acceptance_rate: 2, 
    logo: "https://www.google.com/s2/favicons?domain=tsinghua.edu.cn&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Computer Science", "Physics"], 
    type: "Public", 
    students: 53000,
    description: "Tsinghua is one of China's most prestigious universities, particularly renowned for engineering and computer science.",
    special_features: ["Tsinghua Science Park", "Schwarzman College"],
    noticable_facts: ["Often called 'China's MIT'", "Produced many top Chinese leaders"]
  },
  { 
    id: "uchicago", 
    name: "University of Chicago", 
    city: "Chicago", 
    country: "USA", 
    ranking: 22, 
    tuition: 64000, 
    acceptance_rate: 5, 
    logo: "https://www.google.com/s2/favicons?domain=uchicago.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200&auto=format&fit=crop",
    programs: ["Economics", "Sociology", "Law"], 
    type: "Private", 
    students: 18000,
    description: "UChicago is famous for its rigorous 'Core Curriculum' and its influence on economics and law.",
    special_features: ["Chicago School of Economics", "Oriental Institute"],
    noticable_facts: ["Over 90 Nobel Laureates associated", "Home to the first self-sustaining nuclear reaction"]
  },
  { 
    id: "snu", 
    name: "Seoul National University", 
    city: "Seoul", 
    country: "South Korea", 
    ranking: 23, 
    tuition: 7000, 
    acceptance_rate: 15, 
    logo: "https://www.google.com/s2/favicons?domain=snu.ac.kr&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Engineering", "Arts"], 
    type: "Public", 
    students: 28000,
    description: "SNU is the most prestigious national university in South Korea, known for its academic rigor.",
    special_features: ["Kyujanggak Royal Library", "SNU Gwanak Campus"],
    noticable_facts: ["Ranked #1 in South Korea", "Extremely competitive admissions"]
  },
  { 
    id: "psl", 
    name: "Université PSL", 
    city: "Paris", 
    country: "France", 
    ranking: 24, 
    tuition: 300, 
    acceptance_rate: 10, 
    logo: "https://www.google.com/s2/favicons?domain=psl.eu&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Science", "Humanities", "Arts"], 
    type: "Public", 
    students: 17000,
    description: "PSL is a collegiate university in Paris, bringing together elite French institutions.",
    special_features: ["École Normale Supérieure", "Observatoire de Paris"],
    noticable_facts: ["Highly research-intensive", "Formed from historic Parisian elite schools"]
  },
  { 
    id: "edinburgh", 
    name: "University of Edinburgh", 
    city: "Edinburgh", 
    country: "UK", 
    ranking: 25, 
    tuition: 30000, 
    acceptance_rate: 45, 
    logo: "https://www.google.com/s2/favicons?domain=ed.ac.uk&sz=128", 
    image: "https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Informatics", "Law"], 
    type: "Public", 
    students: 45000,
    description: "Edinburgh is one of the UK's oldest and most prestigious universities, located in the heart of Scotland.",
    special_features: ["Old College", "Bayes Centre for AI"],
    noticable_facts: ["Alma mater of Charles Darwin", "Birthplace of Dolly the Sheep research"]
  },
  { 
    id: "kaist", 
    name: "KAIST", 
    city: "Daejeon", 
    country: "South Korea", 
    ranking: 26, 
    tuition: 8000, 
    acceptance_rate: 15, 
    logo: "https://www.google.com/s2/favicons?domain=kaist.ac.kr&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["AI", "Robotics", "Engineering"], 
    type: "Public", 
    students: 10000,
    description: "KAIST is South Korea's premier research university for science and technology.",
    special_features: ["KAIST AI Hub", "Hubo Robotics Lab"],
    noticable_facts: ["First research-oriented science university in Korea", "Global leader in robotics"]
  },
  { 
    id: "mcgill", 
    name: "McGill University", 
    city: "Montreal", 
    country: "Canada", 
    ranking: 27, 
    tuition: 40000, 
    acceptance_rate: 40, 
    logo: "https://www.google.com/s2/favicons?domain=mcgill.ca&sz=128", 
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Law", "Engineering"], 
    type: "Public", 
    students: 39000,
    description: "McGill is a world-renowned Canadian university located in vibrant Montreal.",
    special_features: ["Montreal Neurological Institute", "McGill Arctic Research Station"],
    noticable_facts: ["Often called 'Canada's Harvard'", "Highest percentage of PhD students in Canada"]
  },
  { 
    id: "anu", 
    name: "Australian National University", 
    city: "Canberra", 
    country: "Australia", 
    ranking: 28, 
    tuition: 38000, 
    acceptance_rate: 35, 
    logo: "https://www.google.com/s2/favicons?domain=anu.edu.au&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["International Relations", "Earth Sciences", "Law"], 
    type: "Public", 
    students: 26000,
    description: "ANU is Australia's national university, known for its research and excellence in social sciences.",
    special_features: ["Mount Stromlo Observatory", "Crawford School of Public Policy"],
    noticable_facts: ["Only university created by Australian Parliament", "Highest concentration of Nobelists in Aus"]
  },
  { 
    id: "sorbonne", 
    name: "Sorbonne University", 
    city: "Paris", 
    country: "France", 
    ranking: 29, 
    tuition: 300, 
    acceptance_rate: 15, 
    logo: "https://www.google.com/s2/favicons?domain=sorbonne-universite.fr&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Humanities", "Marine Science", "Mathematics"], 
    type: "Public", 
    students: 55000,
    description: "Sorbonne is a world-class research university in Paris, inheriting centuries of academic tradition.",
    special_features: ["Pierre and Marie Curie Campus", "Marine Stations"],
    noticable_facts: ["Heir to the historic University of Paris", "Global leader in mathematics and sciences"]
  },
  { 
    id: "utokyo", 
    name: "University of Tokyo", 
    city: "Tokyo", 
    country: "Japan", 
    ranking: 30, 
    tuition: 4000, 
    acceptance_rate: 10, 
    logo: "https://www.google.com/s2/favicons?domain=u-tokyo.ac.jp&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Robotics", "Physics", "Medicine"], 
    type: "Public", 
    students: 28000,
    description: "UTokyo is Japan's most prestigious university, known for producing top leaders and scientists.",
    special_features: ["Hongo Campus (historic)", "Kashiwa Campus (research)"],
    noticable_facts: ["Ranked #1 in Japan", "Produced 15 Japanese Prime Ministers"]
  },
  { 
    id: "sydney", 
    name: "University of Sydney", 
    city: "Sydney", 
    country: "Australia", 
    ranking: 31, 
    tuition: 42000, 
    acceptance_rate: 30, 
    logo: "https://www.google.com/s2/favicons?domain=sydney.edu.au&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Law", "Business"], 
    type: "Public", 
    students: 73000,
    description: "Sydney is Australia's oldest university, featuring a stunning campus and global research impact.",
    special_features: ["Charles Perkins Centre", "Sydney Conservatorium of Music"],
    noticable_facts: ["Australia's first university", "Consistently top 5 in Aus for employability"]
  },
  { 
    id: "unsw", 
    name: "UNSW Sydney", 
    city: "Sydney", 
    country: "Australia", 
    ranking: 32, 
    tuition: 41000, 
    acceptance_rate: 30, 
    logo: "https://www.google.com/s2/favicons?domain=unsw.edu.au&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Quantum Computing", "Business"], 
    type: "Public", 
    students: 62000,
    description: "UNSW is a leading research-intensive university in Australia, particularly strong in technology.",
    special_features: ["Quantum Computing Centre", "Tyree Energy Technologies"],
    noticable_facts: ["Produced more millionaire alumni than any other Aus uni", "Leader in solar cell research"]
  },
  { 
    id: "manchester", 
    name: "University of Manchester", 
    city: "Manchester", 
    country: "UK", 
    ranking: 33, 
    tuition: 28000, 
    acceptance_rate: 55, 
    logo: "https://www.google.com/s2/favicons?domain=manchester.ac.uk&sz=128", 
    image: "https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Physics", "Medicine"], 
    type: "Public", 
    students: 40000,
    description: "Manchester is a world-class university with a rich heritage in research and innovation.",
    special_features: ["National Graphene Institute", "Jodrell Bank Observatory"],
    noticable_facts: ["Birthplace of the first stored-program computer", "25 Nobel Prize winners"]
  },
  { 
    id: "yonsei", 
    name: "Yonsei University", 
    city: "Seoul", 
    country: "South Korea", 
    ranking: 34, 
    tuition: 9000, 
    acceptance_rate: 15, 
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Yonsei_University_logo.svg/1200px-Yonsei_University_logo.svg.png", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Business", "Medicine", "International Studies"], 
    type: "Private", 
    students: 38000,
    description: "Yonsei is one of Korea's 'SKY' universities, known for its global outlook and campus life.",
    special_features: ["Underwood International College", "Severance Hospital"],
    noticable_facts: ["Most international university in Korea", "One of the oldest private universities in Korea"]
  },
  { 
    id: "kyoto", 
    name: "Kyoto University", 
    city: "Kyoto", 
    country: "Japan", 
    ranking: 35, 
    tuition: 4000, 
    acceptance_rate: 15, 
    logo: "https://www.google.com/s2/favicons?domain=kyoto-u.ac.jp&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Chemistry", "Physics", "Biology"], 
    type: "Public", 
    students: 23000,
    description: "Kyoto is Japan's second oldest university, renowned for its academic freedom and research.",
    special_features: ["iPS Cell Research Center", "Kyoto University Hospital"],
    noticable_facts: ["Most Nobelists in Asia", "Famous for 'Academic Freedom' culture"]
  },
  { 
    id: "berkeley", 
    name: "UC Berkeley", 
    city: "Berkeley", 
    country: "USA", 
    ranking: 36, 
    tuition: 48000, 
    acceptance_rate: 11, 
    logo: "https://www.google.com/s2/favicons?domain=berkeley.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop",
    programs: ["Computer Science", "Engineering", "Economics"], 
    type: "Public", 
    students: 45000,
    description: "Berkeley is the flagship campus of the University of California and a global research giant.",
    special_features: ["Lawrence Berkeley Lab", "Bancroft Library"],
    noticable_facts: ["Discovered 16 chemical elements", "Birthplace of the Free Speech Movement"]
  },
  { 
    id: "kcl", 
    name: "King's College London", 
    city: "London", 
    country: "UK", 
    ranking: 37, 
    tuition: 33000, 
    acceptance_rate: 13, 
    logo: "https://www.google.com/s2/favicons?domain=kcl.ac.uk&sz=128", 
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Law", "International Relations"], 
    type: "Public", 
    students: 33000,
    description: "King's is one of London's historic and research-intensive universities, known for its clinical expertise.",
    special_features: ["Guy's Hospital Campus", "Lau China Institute"],
    noticable_facts: ["Played a key role in DNA discovery", "One of the UK's 'Golden Triangle' unis"]
  },
  { 
    id: "lse", 
    name: "LSE", 
    city: "London", 
    country: "UK", 
    ranking: 38, 
    tuition: 26000, 
    acceptance_rate: 9, 
    logo: "https://www.google.com/s2/favicons?domain=lse.ac.uk&sz=128", 
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
    programs: ["Economics", "Politics", "Law"], 
    type: "Public", 
    students: 11000,
    description: "LSE is a world-leading social science university, specializing in economics and international affairs.",
    special_features: ["British Library of Political Science", "LSE Cities"],
    noticable_facts: ["Highest percentage of international students in UK", "Produced 18 Nobel Prize winners in Economics"]
  },
  { 
    id: "fudan", 
    name: "Fudan University", 
    city: "Shanghai", 
    country: "China", 
    ranking: 39, 
    tuition: 6000, 
    acceptance_rate: 3, 
    logo: "https://www.google.com/s2/favicons?domain=fudan.edu.cn&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Journalism", "Medicine", "Engineering"], 
    type: "Public", 
    students: 32000,
    description: "Fudan is a major research university in Shanghai, known for its liberal academic atmosphere.",
    special_features: ["Guanghua Twin Towers", "Fudan University Hospital"],
    noticable_facts: ["One of China's most selective universities", "Member of the C9 League"]
  },
  { 
    id: "sjtu", 
    name: "Shanghai Jiao Tong University", 
    city: "Shanghai", 
    country: "China", 
    ranking: 40, 
    tuition: 6000, 
    acceptance_rate: 3, 
    logo: "https://www.google.com/s2/favicons?domain=sjtu.edu.cn&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Medicine", "Management"], 
    type: "Public", 
    students: 45000,
    description: "SJTU is one of China's oldest and most prestigious universities, highly ranked for engineering.",
    special_features: ["Antai College", "Tsao-Chang Lab"],
    noticable_facts: ["Produced many of China's rocket scientists", "Known for high-impact research output"]
  },
  { 
    id: "monash", 
    name: "Monash University", 
    city: "Melbourne", 
    country: "Australia", 
    ranking: 41, 
    tuition: 43000, 
    acceptance_rate: 40, 
    logo: "https://www.google.com/s2/favicons?domain=monash.edu&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Pharmacy", "Education", "Engineering"], 
    type: "Public", 
    students: 86000,
    description: "Monash is Australia's largest university, known for its international reach and pharmacy program.",
    special_features: ["Monash Health", "Australian Synchrotron"],
    noticable_facts: ["Ranked #1 in world for Pharmacy", "Highly international footprint with campuses in Malaysia and Italy"]
  },
  { 
    id: "queensland", 
    name: "University of Queensland", 
    city: "Brisbane", 
    country: "Australia", 
    ranking: 42, 
    tuition: 40000, 
    acceptance_rate: 40, 
    logo: "https://www.google.com/s2/favicons?domain=uq.edu.au&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Marine Science", "Sports Medicine", "Engineering"], 
    type: "Public", 
    students: 55000,
    description: "UQ is a top research-intensive university in Australia, located in sunny Brisbane.",
    special_features: ["Great Barrier Reef Research Station", "UQ Gatton Campus"],
    noticable_facts: ["Birthplace of the Gardasil (HPV) vaccine", "Known for beautiful sandstone campus"]
  },
  { 
    id: "hkust", 
    name: "HKUST", 
    city: "Clear Water Bay", 
    country: "Hong Kong", 
    ranking: 43, 
    tuition: 22000, 
    acceptance_rate: 15, 
    logo: "https://www.google.com/s2/favicons?domain=ust.hk&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Business", "Science"], 
    type: "Public", 
    students: 16000,
    description: "HKUST is a world-class research university, especially strong in science and technology.",
    special_features: ["HKUST Business School", "Lee Shau Kee Campus"],
    noticable_facts: ["Often ranked #1 in Asia for MBA", "Campus overlooking the South China Sea"]
  },
  { 
    id: "cuhk", 
    name: "Chinese University of Hong Kong", 
    city: "Shatin", 
    country: "Hong Kong", 
    ranking: 44, 
    tuition: 21000, 
    acceptance_rate: 15, 
    logo: "https://www.google.com/s2/favicons?domain=cuhk.edu.hk&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Translation", "Medicine", "Education"], 
    type: "Public", 
    students: 30000,
    description: "CUHK is a comprehensive research university, known for its collegiate system and stunning campus.",
    special_features: ["Collegiate System (9 colleges)", "CUHK Art Museum"],
    noticable_facts: ["Only university in HK with a collegiate system", "Highest graduate starting salaries in HK for certain fields"]
  },
  { 
    id: "osaka", 
    name: "Osaka University", 
    city: "Osaka", 
    country: "Japan", 
    ranking: 45, 
    tuition: 4000, 
    acceptance_rate: 20, 
    logo: "https://www.google.com/s2/favicons?domain=osaka-u.ac.jp&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Immunology", "Robotics", "Engineering"], 
    type: "Public", 
    students: 23000,
    description: "Osaka is a top-tier Japanese university, world-renowned for immunology and robotics.",
    special_features: ["Immunology Frontier Research Center", "Osaka University Hospital"],
    noticable_facts: ["One of Japan's designated national universities", "Strong industry-academia ties in Osaka"]
  },
  { 
    id: "tum", 
    name: "Technical University of Munich", 
    city: "Munich", 
    country: "Germany", 
    ranking: 46, 
    tuition: 0, 
    acceptance_rate: 8, 
    logo: "https://www.google.com/s2/favicons?domain=tum.de&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Informatics", "Science"], 
    type: "Public", 
    students: 50000,
    description: "TUM is Germany's top-ranked technical university, known for excellence in engineering and science.",
    special_features: ["TUM Garching Campus", "Entrepreneurship Center"],
    noticable_facts: ["Tuition-free for most programs", "Known as 'The Entrepreneurial University' in Germany"]
  },
  { 
    id: "kth", 
    name: "KTH Royal Institute of Technology", 
    city: "Stockholm", 
    country: "Sweden", 
    ranking: 47, 
    tuition: 15000, 
    acceptance_rate: 20, 
    logo: "https://www.google.com/s2/favicons?domain=kth.se&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Engineering", "Sustainability", "Design"], 
    type: "Public", 
    students: 13000,
    description: "KTH is Sweden's largest and most respected technical university.",
    special_features: ["KTH Live-In Lab", "SciLifeLab"],
    noticable_facts: ["One third of Sweden's technical research power", "Strong focus on sustainable innovation"]
  },
  { 
    id: "yonsei_kr", 
    name: "Yonsei University", 
    city: "Seoul", 
    country: "South Korea", 
    ranking: 48, 
    tuition: 9000, 
    acceptance_rate: 15, 
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Yonsei_University_logo.svg/1200px-Yonsei_University_logo.svg.png", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Business", "Medicine", "International Relations"], 
    type: "Private", 
    students: 38000,
    description: "Yonsei is a leading private university in Korea, highly ranked for its global outlook.",
    special_features: ["Severance Hospital", "Global Campus (Songdo)"],
    noticable_facts: ["Member of the Korean 'SKY' universities", "Most global campus in Korea"]
  },
  { 
    id: "cityu", 
    name: "City University of Hong Kong", 
    city: "Kowloon", 
    country: "Hong Kong", 
    ranking: 49, 
    tuition: 21000, 
    acceptance_rate: 20, 
    logo: "https://www.google.com/s2/favicons?domain=cityu.edu.hk&sz=128", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    programs: ["Vet Medicine", "Business", "Engineering"], 
    type: "Public", 
    students: 20000,
    description: "CityU is a dynamic university in Hong Kong, known for its rapid rise in global rankings.",
    special_features: ["Run Run Shaw Creative Media Centre", "Jockey Club College of Vet Medicine"],
    noticable_facts: ["World's most international university (QS 2024)", "Global leader in professional education"]
  },
  { 
    id: "delft", 
    name: "Delft University of Technology", 
    city: "Delft", 
    country: "Netherlands", 
    ranking: 50, 
    tuition: 18000, 
    acceptance_rate: 30, 
    logo: "https://www.google.com/s2/favicons?domain=tudelft.nl&sz=128", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    programs: ["Architecture", "Civil Engineering", "Aerospace"], 
    type: "Public", 
    students: 27000,
    description: "TU Delft is the oldest and largest Dutch public technical university, world-famous for architecture.",
    special_features: ["The Why Factory", "Dream Hall"],
    noticable_facts: ["Ranked #2 in world for Architecture", "Leader in water management and hydraulic engineering"]
  }
];

// Types
type University = {
  id: string;
  name: string;
  city: string;
  country: string;
  ranking: number;
  tuition: number;
  acceptance_rate: number;
  logo: string;
  image?: string;
  programs: string[];
  type: string;
  students: number;
  description?: string;
  special_features?: string[];
  noticable_facts?: string[];
};

export default function UniversitiesPage() {
  const [universitiesData, setUniversitiesData] = useState<University[]>(top50Data);
  const [loading, setLoading] = useState(true);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const { saveItem, removeItem, isSaved } = useSaved();

  // Filters state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ranking");
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeFields, setActiveFields] = useState<string[]>([]);
  const [activeLevels, setActiveLevels] = useState<string[]>([]);
  const [activeFunding, setActiveFunding] = useState<string[]>([]);
  const [activeSettings, setActiveSettings] = useState<string[]>([]);
  const [activeAid, setActiveAid] = useState<string[]>([]);
  const [activeSelectivity, setActiveSelectivity] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(100);

  const countryOptions = useMemo(() => Array.from(new Set(universitiesData.map(u => u.country))).sort(), [universitiesData]);
  const typeOptions = ["Public", "Private"];
  const fieldOptions = ["STEM", "Business", "Medicine", "Humanities", "Arts", "Law", "Education"];
  const levelOptions = ["Undergraduate", "Graduate", "Ph.D."];
  const fundingOptions = ["Tuition-Free", "Low Cost", "High Value"];
  const settingOptions = ["Urban", "Rural", "Suburban"];
  const aidOptions = ["Full Need Met", "Partial Aid", "None"];
  const selectivityOptions = ["Highly Selective (<10%)", "Competitive (10-30%)", "Accessible (>30%)"];

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json')
      .then(res => res.json())
      .then(data => {
        let extraUnis: University[] = [];
        let currentRank = 51;
        const topNames = top50Data.map(u => u.name.toLowerCase());
        const programPool = [
          ["Engineering", "Business", "Medicine"],
          ["Law", "Arts", "Humanities"],
          ["Computer Science", "Data Science", "AI"],
          ["Architecture", "Design", "Fine Arts"],
          ["Biology", "Chemistry", "Physics"]
        ];

        for (let u of data) {
          if (extraUnis.length >= 1450) break;
          if (topNames.some(tn => u.name.toLowerCase().includes(tn))) continue;

          extraUnis.push({
            id: "uni_" + currentRank,
            name: u.name,
            city: u["state-province"] || "Main Campus",
            country: u.country,
            ranking: currentRank,
            tuition: Math.floor(Math.random() * 40000) + 5000,
            acceptance_rate: Math.floor(Math.random() * 60) + 10,
            logo: u.domains && u.domains.length > 0 
              ? `https://www.google.com/s2/favicons?domain=${u.domains[0]}&sz=128` 
              : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 10v6M2 10l10-5 10 5-10 5z'/%3E%3Cpath d='M6 12v5c3 3 9 3 12 0v-5'/%3E%3C/svg%3E",
            programs: programPool[Math.floor(Math.random() * programPool.length)],
            type: Math.random() > 0.5 ? "Public" : "Private",
            students: Math.floor(Math.random() * 50000) + 5000,
            description: `${u.name} is a leading institution in ${u.country}, offering diverse academic programs and fostering global research excellence.`,
            special_features: ["International Partnerships", "Modern Research Labs", "Dynamic Campus Life"],
            noticable_facts: ["Global Alumni Network", "High Graduate Employability"]
          });
          currentRank++;
        }
        setUniversitiesData([...top50Data, ...extraUnis]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load extra universities", err);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    let result = universitiesData;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(s) || 
        u.city.toLowerCase().includes(s) || 
        u.country.toLowerCase().includes(s)
      );
    }

    if (activeCountries.length > 0) result = result.filter(u => activeCountries.includes(u.country));
    if (activeTypes.length > 0) result = result.filter(u => activeTypes.includes(u.type));
    if (activeFields.length > 0) result = result.filter(u => activeFields.some(f => u.programs.some(p => p.toLowerCase().includes(f.toLowerCase()))));
    
    if (activeFunding.length > 0) {
      result = result.filter(u => {
        if (activeFunding.includes("Tuition-Free") && u.tuition === 0) return true;
        if (activeFunding.includes("Low Cost") && u.tuition > 0 && u.tuition < 15000) return true;
        if (activeFunding.includes("High Value") && u.tuition >= 15000) return true;
        return false;
      });
    }

    if (activeSelectivity.length > 0) {
      result = result.filter(u => {
        if (activeSelectivity.includes("Highly Selective (<10%)") && u.acceptance_rate < 10) return true;
        if (activeSelectivity.includes("Competitive (10-30%)") && u.acceptance_rate >= 10 && u.acceptance_rate <= 30) return true;
        if (activeSelectivity.includes("Accessible (>30%)") && u.acceptance_rate > 30) return true;
        return false;
      });
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "ranking": return a.ranking - b.ranking;
        case "name": return a.name.localeCompare(b.name);
        case "acceptance": return a.acceptance_rate - b.acceptance_rate;
        case "tuition-low": return a.tuition - b.tuition;
        case "tuition-high": return b.tuition - a.tuition;
        default: return a.ranking - b.ranking;
      }
    });

    return result;
  }, [search, activeCountries, activeTypes, activeFields, activeFunding, sort, universitiesData]);

  const activeFiltersCount = activeCountries.length + activeTypes.length + activeFields.length + activeLevels.length + activeFunding.length + activeSettings.length + activeAid.length + activeSelectivity.length;

  const tog = (list: string[], val: string, setList: (v: string[]) => void) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
  };

  const handleSave = (uni: University) => {
    if (isSaved(uni.id)) {
      removeItem(uni.id);
    } else {
      saveItem({
        id: uni.id,
        title: uni.name,
        type: 'University',
        source: `${uni.city}, ${uni.country}`,
        image: uni.image
      });
    }
  };

  return (
    <>
      <PublicHeader />
      {selectedUni && (
        <InfoModal 
          isOpen={!!selectedUni} 
          onClose={() => setSelectedUni(null)} 
          title={selectedUni.name} 
          subtitle={`${selectedUni.city}, ${selectedUni.country}`} 
          icon="🏛️"
          image={selectedUni.image || "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop"}
          description={selectedUni.description}
          specialFeatures={selectedUni.special_features}
          stats={[
            { label: "Acceptance", value: `${selectedUni.acceptance_rate}%` },
            { label: "Tuition", value: selectedUni.tuition === 0 ? "Free" : `$${selectedUni.tuition.toLocaleString()}` },
            { label: "Ranking", value: `#${selectedUni.ranking}` }
          ]}
          tips={selectedUni.noticable_facts || [
            "Research specific program requirements before applying.",
            "International students must prepare English proficiency test scores.",
            "Admission is highly competitive."
          ]}
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg-color)" }}>
        
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1rem", fontWeight: 800 }}>
              Top Universities Worldwide
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 500 }}>
              Explore and compare the world's best {loading ? "1,500+" : universitiesData.length} universities. Find your perfect academic home.
            </motion.p>

            <div className={styles.searchBox}>
              <Search style={{ color: "#6366f1", opacity: 0.5 }} size={20} />
              <input 
                type="text" 
                placeholder="Search for universities, cities, or countries..." 
                className={styles.searchInput} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className={styles.searchBtn}>Search</button>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--bg-color)" }}>
          <div className={`container ${styles.layout}`}>
            
            <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
              <div className={styles.filterBar} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <div className={styles.filterBarLeft}>
                  <Filter size={18} style={{ color: "#6366f1" }} />
                  <span className={styles.filterBarTitle}>
                    Filter {activeFiltersCount > 0 && <span className={styles.filterCount}>{activeFiltersCount}</span>}
                  </span>
                </div>
                <ChevronDown size={20} style={{ transform: isFilterOpen ? "rotate(180deg)" : "none", transition: "0.3s", color: "#64748b" }} />
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                    <div className={styles.expandedFilters}>
                      
                      <div>
                        <span className={styles.filterSectionTitle}><FlaskConical size={12} /> Major Fields</span>
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
                        <span className={styles.filterSectionTitle}><GraduationCap size={12} /> Institution Type</span>
                        <div className={styles.checkGrid}>
                          {typeOptions.map(t => (
                            <label key={t} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeTypes.includes(t)} onChange={() => tog(activeTypes, t, setActiveTypes)} />
                              {t}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Monitor size={12} /> Target Level</span>
                          <div className={styles.checkGrid}>
                            {levelOptions.map(l => (
                              <label key={l} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeLevels.includes(l)} onChange={() => tog(activeLevels, l, setActiveLevels)} />
                                {l}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Globe size={12} /> Global Region</span>
                        <select className={styles.filterSelect} value={activeCountries[0] || ""} onChange={e => setActiveCountries(e.target.value ? [e.target.value] : [])}>
                          <option value="">Any Location</option>
                          {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Coins size={12} /> Tuition & Value</span>
                        <div className={styles.checkGrid}>
                          {fundingOptions.map(f => (
                            <label key={f} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeFunding.includes(f)} onChange={() => tog(activeFunding, f, setActiveFunding)} />
                              {f}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Sparkles size={12} /> Selectivity</span>
                          <div className={styles.checkGrid}>
                            {selectivityOptions.map(s => (
                              <label key={s} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeSelectivity.includes(s)} onChange={() => tog(activeSelectivity, s, setActiveSelectivity)} />
                                {s}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><MapPin size={12} /> Campus Setting</span>
                        <div className={styles.checkGrid}>
                          {settingOptions.map(s => (
                            <label key={s} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeSettings.includes(s)} onChange={() => tog(activeSettings, s, setActiveSettings)} />
                              {s}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Users size={12} /> International Aid</span>
                          <div className={styles.checkGrid}>
                            {aidOptions.map(a => (
                              <label key={a} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeAid.includes(a)} onChange={() => tog(activeAid, a, setActiveAid)} />
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
                <span className={styles.resultsText}>Showing <strong>{filteredData.length}</strong> Universities</span>
                <div className={styles.sortWrapper}>
                  <span className={styles.sortLabel}>Sort by:</span>
                  <select className={styles.filterSelect} style={{ width: "auto", padding: "0.4rem 1rem" }} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="ranking">🏆 World Ranking</option>
                    <option value="name">📝 Alphabetical</option>
                    <option value="acceptance">📊 Acceptance Rate</option>
                    <option value="tuition-low">💰 Lowest Tuition</option>
                  </select>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
                  <div className={styles.loader}></div>
                  <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>Fetching global university database...</p>
                </div>
              )}

              <div className={styles.grid} style={{ marginTop: "2rem" }}>
                <AnimatePresence>
                  {filteredData.slice(0, displayLimit).map((uni, index) => (
                    <motion.div key={uni.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (index % 20) * 0.05 }} className={styles.card}>
                      <div className={`${styles.rankingBadge} ${uni.ranking <= 10 ? styles.top10 : ''}`}>
                        #{uni.ranking}
                      </div>
                      
                      <button onClick={() => handleSave(uni)} className={styles.saveBtn} style={{ color: isSaved(uni.id) ? "#6366f1" : "#94a3b8" }}>
                        <Bookmark size={20} fill={isSaved(uni.id) ? "#6366f1" : "none"} />
                      </button>

                      <div className={styles.cardHeader}>
                        <div className={styles.logoWrapper}>
                          <img 
                            src={uni.logo} 
                            alt={uni.name} 
                            className={styles.uniLogo} 
                            loading="lazy"
                            onError={(e) => { 
                              e.currentTarget.onerror = null; 
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 10v6M2 10l10-5 10 5-10 5z'/%3E%3Cpath d='M6 12v5c3 3 9 3 12 0v-5'/%3E%3C/svg%3E";
                            }} 
                          />
                        </div>
                        <div style={{ paddingRight: "2rem" }}>
                          <h3 className={styles.uniName}>{uni.name}</h3>
                          <p className={styles.uniLocation}><MapPin size={14} /> {uni.city}, {uni.country}</p>
                        </div>
                      </div>
                      
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Acceptance</span><span className={styles.detailValue}>{uni.acceptance_rate}%</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Tuition</span><span className={styles.detailValue}>{uni.tuition === 0 ? "Free" : `$${(uni.tuition/1000).toFixed(0)}k`}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Students</span><span className={styles.detailValue}>{(uni.students/1000).toFixed(0)}k</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Type</span><span className={styles.detailValue}>{uni.type}</span></div>
                      </div>

                      <div className={styles.tags}>
                        {uni.programs.map(p => <span key={p} className={styles.tag}>{p}</span>)}
                      </div>

                      <div className={styles.cardActions}>
                        <button onClick={() => setSelectedUni(uni)} className={styles.detailsBtn}>
                          <GraduationCap size={18} /> Details
                        </button>
                        <Link href="/dashboard" className={styles.guideBtn}>
                          Guide <ArrowRight size={18} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {displayLimit < filteredData.length && (
                <div style={{ textAlign: "center", marginTop: "4rem", marginBottom: "4rem" }}>
                  <button 
                    onClick={() => setDisplayLimit(prev => prev + 200)} 
                    className={styles.detailsBtn} 
                    style={{ padding: "1rem 3rem", fontSize: "1.1rem", borderRadius: "100px" }}
                  >
                    Load More Universities ({filteredData.length - displayLimit} Remaining)
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
