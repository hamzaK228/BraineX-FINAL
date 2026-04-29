"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Flag, CheckCircle2, Circle, Lock, Plus, X, ArrowLeft, MoreVertical, Route, Trash2, Search, Sparkles } from "lucide-react";

export default function RoadmapsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // State for all roadmaps
  const [roadmaps, setRoadmaps] = useState<any[]>([]);

  const fetchRoadmaps = useCallback(async () => {
    try {
      const res = await fetch("/api/roadmaps");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRoadmaps(data.map((rm: any) => ({ 
            id: rm.id, 
            title: rm.title, 
            desc: rm.description || "", 
            iconColor: rm.color || "#8b5cf6", 
            steps: (rm.steps || []).map((s: any) => ({ 
              id: s.id, 
              title: s.title, 
              desc: s.description || "", 
              status: s.isCompleted ? "completed" : "in-progress", 
              date: s.date || "TBD" 
            })) 
          })));
        }
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchRoadmaps(); }, [fetchRoadmaps]);

  const [activeRoadmapId, setActiveRoadmapId] = useState<string | number | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isAddingRoadmap, setIsAddingRoadmap] = useState(false);
  const [newRoadmap, setNewRoadmap] = useState({ title: "", desc: "", color: "#8b5cf6" });

  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStep, setNewStep] = useState({ title: "", desc: "", status: "locked", date: "" });

  const handleAddRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadmap.title.trim()) return;

    const temp = { id: Date.now(), title: newRoadmap.title, desc: newRoadmap.desc || "A custom roadmap", iconColor: newRoadmap.color, steps: [] as any[] };
    setRoadmaps([...roadmaps, temp]);
    setNewRoadmap({ title: "", desc: "", color: "#8b5cf6" });
    setIsAddingRoadmap(false);

    try {
      const res = await fetch("/api/roadmaps", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: temp.title, description: temp.desc, color: temp.iconColor }) });
      if (res.ok) { const saved = await res.json(); setRoadmaps(prev => prev.map(r => r.id === temp.id ? { ...r, id: saved.id } : r)); }
    } catch { /* silent */ }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.title.trim() || activeRoadmapId === null) return;

    const tempStep = { id: Date.now(), title: newStep.title, desc: newStep.desc || "No description", status: newStep.status, date: newStep.date || "TBD" };
    setRoadmaps(roadmaps.map(rm => rm.id === activeRoadmapId ? { ...rm, steps: [...rm.steps, tempStep] } : rm));
    setNewStep({ title: "", desc: "", status: "locked", date: "" });
    setIsAddingStep(false);

    try {
      await fetch(`/api/roadmaps/${activeRoadmapId}/steps`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: tempStep.title, description: tempStep.desc, status: tempStep.status, date: tempStep.date }) });
    } catch { /* silent */ }
  };

  const markComplete = async (roadmapId: string | number, stepId: string | number) => {
    setRoadmaps(roadmaps.map(rm => rm.id === roadmapId ? { ...rm, steps: rm.steps.map((step: any) => step.id === stepId ? { ...step, status: "completed" } : step) } : rm));
    try { await fetch(`/api/roadmaps/${roadmapId}/steps/${stepId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isCompleted: true }) }); } catch { /* silent */ }
  };

  const deleteRoadmap = async (id: string | number) => {
    setRoadmaps(roadmaps.filter(rm => rm.id !== id));
    try { await fetch(`/api/roadmaps/${id}`, { method: "DELETE" }); } catch { /* silent */ }
  };

  const deleteStep = async (roadmapId: string | number, stepId: string | number) => {
    setRoadmaps(roadmaps.map(rm => rm.id === roadmapId ? { ...rm, steps: rm.steps.filter((step: any) => step.id !== stepId) } : rm));
    try { await fetch(`/api/roadmaps/${roadmapId}/steps/${stepId}`, { method: "DELETE" }); } catch { /* silent */ }
  };

  const getProgress = (steps: any[]) => {
    if (steps.length === 0) return 0;
    const completed = steps.filter(s => s.status === "completed").length;
    return Math.round((completed / steps.length) * 100);
  };

  const activeRoadmap = roadmaps.find(rm => rm.id === activeRoadmapId);

  const ELITE_TEMPLATES = [
    {
      id: "t1",
      title: "Cybersecurity Analyst",
      desc: "Protect systems and networks from digital attacks.",
      color: "#ef4444",
      steps: [
        { title: "Networking Fundamentals", desc: "TCP/IP, OSI, and Subnetting. Resources: Professor Messer (YouTube), Cisco Networking Academy, Wireshark Docs." },
        { title: "Linux for Security", desc: "Bash scripting and system admin. Resources: OverTheWire (Bandit), Linux Journey, TryHackMe Linux Room." },
        { title: "Web Vulnerabilities", desc: "OWASP Top 10 and Burp Suite. Resources: PortSwigger Academy, OWASP Documentation." },
        { title: "Penetration Testing", desc: "Exploitation frameworks and scanning. Resources: Metasploit Unleashed, Hack The Box." },
        { title: "Incident Response", desc: "Threat hunting and log analysis. Resources: SANS Institute Reading Room, Blue Team Labs Online." }
      ]
    },
    {
      id: "t2",
      title: "Machine Learning Engineer",
      desc: "Dive deep into Python and neural networks.",
      color: "#3b82f6",
      steps: [
        { title: "Mathematics for AI", desc: "Linear Algebra, Calculus, and Statistics. Resources: Khan Academy, 3Blue1Brown, MIT OpenCourseWare." },
        { title: "Python for Data Science", desc: "NumPy, Pandas, and Matplotlib. Resources: Kaggle Courses, Real Python, Scikit-learn Docs." },
        { title: "Deep Learning Foundations", desc: "Neural Networks and Backpropagation. Resources: Fast.ai, DeepLearning.AI (Coursera)." },
        { title: "Computer Vision / NLP", desc: "Specializing in visual or text data. Resources: Stanford CS231n, Hugging Face Course." },
        { title: "MLOps & Deployment", desc: "Model versioning and serving. Resources: Made With ML, Docker Docs." }
      ]
    },
    {
      id: "t3",
      title: "Full-Stack Web3 Developer",
      desc: "Build decentralized applications with Solidity.",
      color: "#10b981",
      steps: [
        { title: "Frontend Mastery", desc: "Modern React and Next.js. Resources: Beta React Docs, Vercel Academy." },
        { title: "Blockchain Fundamentals", desc: "Cryptography and Consensus. Resources: Whiteboard Crypto, Bitcoin Whitepaper." },
        { title: "Solidity & Smart Contracts", desc: "Ethereum development. Resources: CryptoZombies, SpeedRunEthereum." },
        { title: "DeFi & Tokenomics", desc: "Liquidity pools and DEXs. Resources: Uniswap Docs, Finematics (YouTube)." },
        { title: "Security Auditing", desc: "Identifying reentrancy and overflows. Resources: Immunefi Bug Bounty, OpenZeppelin Defender." }
      ]
    },
    {
      id: "t4",
      title: "Cloud Solutions Architect",
      desc: "Design scalable cloud infrastructure on AWS.",
      color: "#f59e0b",
      steps: [
        { title: "Cloud Fundamentals", desc: "Virtualization and IaaS/PaaS. Resources: AWS Cloud Practitioner Essentials." },
        { title: "Compute & Networking", desc: "EC2, VPC, and Load Balancing. Resources: A Cloud Guru, AWS Whitepapers." },
        { title: "Serverless & Database", desc: "Lambda and DynamoDB. Resources: Serverless Land, AWS Documentation." },
        { title: "Infrastructure as Code", desc: "Terraform and CloudFormation. Resources: HashiCorp Learn, Terraform Weekly." },
        { title: "Well-Architected Framework", desc: "Cost, Performance, and Security. Resources: AWS Architecture Center." }
      ]
    },
    {
      id: "t5",
      title: "Quantitative Finance Analyst",
      desc: "Apply math and coding to financial markets.",
      color: "#8b5cf6",
      steps: [
        { title: "Financial Instruments", desc: "Derivatives, Options, and Greeks. Resources: Investopedia, Hull's Options & Futures." },
        { title: "Stochastic Calculus", desc: "Black-Scholes and Brownian Motion. Resources: MIT 18.S096, QuantStart." },
        { title: "C++ for Finance", desc: "High-performance execution code. Resources: QuantNet, LearnCpp.com." },
        { title: "Algorithmic Trading", desc: "Backtesting and Alpha generation. Resources: QuantConnect, Quantopian Archive." },
        { title: "Risk Management", desc: "Value at Risk (VaR) and Stress Testing. Resources: PRMIA, FRM Handbook." }
      ]
    },
    {
      id: "t6",
      title: "Product Manager (Tech)",
      desc: "Bridge the gap between business and engineering.",
      color: "#ec4899",
      steps: [
        { title: "Product Discovery", desc: "Customer interviews and pain points. Resources: Product Talk (Teresa Torres)." },
        { title: "Technical Literacy", desc: "Understanding APIs and Databases. Resources: Tech for Non-Techies (Podcast)." },
        { title: "Agile & Scrum", desc: "Jira and Sprint planning. Resources: Atlassian Agile Coach, Scrum.org." },
        { title: "Metrics & Analytics", desc: "AARRR metrics and SQL. Resources: Reforge, Amplitude Academy." },
        { title: "Product Strategy", desc: "Roadmapping and Vision. Resources: Inspired (Marty Cagan), Lenny's Newsletter." }
      ]
    },
    {
      id: "t7",
      title: "Data Scientist (Bioinformatics)",
      desc: "Analyze genomic data with computational tools.",
      color: "#06b6d4",
      steps: [
        { title: "Biology Foundations", desc: "DNA, Proteins, and Gene Expression. Resources: Khan Academy Biology." },
        { title: "R for Bioinformatics", desc: "Bioconductor and Data Visualization. Resources: EdX HarvardX Biomedical Data Science." },
        { title: "Sequence Analysis", desc: "BLAST and Sequence Alignment. Resources: NCBI Tools, Rosalind.info." },
        { title: "Structural Biology", desc: "Protein folding and AlphaFold. Resources: DeepMind Blog, RCSB PDB." },
        { title: "Next-Gen Sequencing", desc: "NGS workflows and pipelines. Resources: Illumina Training, Galaxy Project." }
      ]
    },
    {
      id: "t8",
      title: "Robotics & Embedded Systems",
      desc: "Build autonomous machines and hardware.",
      color: "#6366f1",
      steps: [
        { title: "Electronics Basics", desc: "Circuits, Microcontrollers, and PCBs. Resources: Adafruit, SparkFun, All About Circuits." },
        { title: "Embedded C/C++", desc: "Writing code for AVR and ARM. Resources: Quantum Leaps (Modern Embedded), RTOS Docs." },
        { title: "Control Systems", desc: "PID Control and Signal Processing. Resources: Brian Douglas (YouTube), Control Guru." },
        { title: "ROS (Robot Operating System)", desc: "Building robot nodes and packages. Resources: ROS.org Wiki, ConstructSim." },
        { title: "Computer Vision for Robots", desc: "OpenCV and SLAM. Resources: PyImageSearch, SLAM Lectures." }
      ]
    },
    {
      id: "t9",
      title: "DevOps & SRE",
      desc: "Automate software delivery and reliability.",
      color: "#14b8a6",
      steps: [
        { title: "CI/CD Pipelines", desc: "GitHub Actions and Jenkins. Resources: GitHub Learning Lab, DevOps Directive." },
        { title: "Containerization", desc: "Docker and Microservices. Resources: Docker Captains, KodeKloud." },
        { title: "Kubernetes Orchestration", desc: "Scaling and managing clusters. Resources: K8s Docs, CKA Prep." },
        { title: "Monitoring & Logging", desc: "Prometheus and ELK Stack. Resources: Grafana Labs, Elastic Training." },
        { title: "Site Reliability", desc: "SLIs, SLOs, and Error Budgets. Resources: Google SRE Book." }
      ]
    },
    {
      id: "t10",
      title: "Game Developer (Unreal)",
      desc: "Create immersive 3D games with C++.",
      color: "#f97316",
      steps: [
        { title: "Unreal Engine Basics", desc: "Blueprints and Editor workflow. Resources: Unreal Engine Learning Portal." },
        { title: "C++ for Unreal", desc: "Gameplay programming and UObjects. Resources: Tom Looman's Blog, Udemy Course." },
        { title: "3D Math & Physics", desc: "Vectors, Quaternions, and Collision. Resources: GDC Vault, Math for Games." },
        { title: "Shaders & Visual Effects", desc: "Niagara and Material Editor. Resources: Ben Cloward (YouTube)." },
        { title: "Game Optimization", desc: "Profiling and Level Streaming. Resources: Unreal Engine Performance Guide." }
      ]
    },
    {
      id: "t11",
      title: "Mobile App Developer (iOS)",
      desc: "Build beautiful apps with Swift and SwiftUI.",
      color: "#0ea5e9",
      steps: [
        { title: "Swift Programming", desc: "Language syntax and protocols. Resources: Hacking with Swift, Swift.org." },
        { title: "SwiftUI Layouts", desc: "Declarative UI design. Resources: Apple Developer Tutorials, DesignCode.io." },
        { title: "Networking & Persistence", desc: "URLSession and CoreData. Resources: Ray Wenderlich (Kodeco)." },
        { title: "iOS Architecture", desc: "MVVM and Combine. Resources: Point-Free, Donny Wals." },
        { title: "App Store Publishing", desc: "App Store Connect and Beta Testing. Resources: Apple Developer Docs." }
      ]
    },
    {
      id: "t12",
      title: "UI/UX Design Lead",
      desc: "Create user-centered digital experiences.",
      color: "#a855f7",
      steps: [
        { title: "Design Principles", desc: "Typography, Color Theory, and Grid. Resources: Nielsen Norman Group, Laws of UX." },
        { title: "Design Tools (Figma)", desc: "Auto Layout and Prototyping. Resources: Figma YouTube, UI Prep." },
        { title: "User Research", desc: "Usability testing and Personas. Resources: Interaction Design Foundation." },
        { title: "Design Systems", desc: "Components and Tokens. Resources: Material Design, Human Interface Guidelines." },
        { title: "Portfolio Building", desc: "Case studies and Storytelling. Resources: Behance, Dribbble, Case Study Club." }
      ]
    },
    {
      id: "t13",
      title: "AR/VR Developer",
      desc: "Design the future of spatial computing.",
      color: "#d946ef",
      steps: [
        { title: "Unity Engine Fundamentals", desc: "C# and 3D environment setup. Resources: Unity Learn, Brackeys." },
        { title: "Spatial Interaction", desc: "Hand tracking and Raycasting. Resources: Meta Presence Platform Docs." },
        { title: "AR Foundation", desc: "Building AR for iOS/Android. Resources: ARCore & ARKit Documentation." },
        { title: "Immersive Audio", desc: "Spatial sound design. Resources: Oculus Audio SDK, FMOD." },
        { title: "Performance in XR", desc: "Frame rates and Latency. Resources: Valve VR Performance Guide." }
      ]
    },
    {
      id: "t14",
      title: "Autonomous Systems",
      desc: "Develop software for self-driving cars.",
      color: "#64748b",
      steps: [
        { title: "Sensor Fusion", desc: "Lidar, Radar, and Camera data. Resources: Udacity Self-Driving Car Nanodegree." },
        { title: "Localization & Mapping", desc: "SLAM and GPS Integration. Resources: Cyrill Stachniss (YouTube)." },
        { title: "Path Planning", desc: "A* and Hybrid A* algorithms. Resources: Coursera Robotics Specialization." },
        { title: "Computer Vision (CV)", desc: "Object detection and Segmentation. Resources: OpenCV, YOLO Docs." },
        { title: "Safety & Simulation", desc: "CARLA Simulator and Apollo. Resources: CARLA.org, Baidu Apollo." }
      ]
    },
    {
      id: "t15",
      title: "FinTech Engineer",
      desc: "Modernize banking and payment systems.",
      color: "#4ade80",
      steps: [
        { title: "Payment Systems", desc: "ACH, SWIFT, and Card Processing. Resources: Stripe Docs, Finix Blog." },
        { title: "Banking as a Service", desc: "Ledgers and Wallets. Resources: Unit.co Docs, Moov.io." },
        { title: "Security & Compliance", desc: "PCI-DSS and KYC/AML. Resources: Plaid Academy, FinCEN." },
        { title: "Low-Latency Backend", desc: "High-throughput transaction systems. Resources: High Scalability Blog." },
        { title: "Embedded Finance", desc: "Integrating lending and cards. Resources: Treasury Prime, Lithic Docs." }
      ]
    }
  ];

  const handleStartTemplate = async (template: any) => {
    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: template.title,
          description: template.desc,
          color: template.color,
          steps: template.steps
        })
      });
      if (res.ok) {
        fetchRoadmaps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const parts = desc.split("Resources:");
    if (parts.length === 1) return <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>{desc}</p>;
    
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>{parts[0].trim()}</p>
        <div style={{ background: "rgba(6, 182, 212, 0.05)", padding: "0.75rem", borderRadius: "12px", border: "1px solid rgba(6, 182, 212, 0.1)" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#06b6d4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resources:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {parts[1].split(",").map((r, i) => (
              <span key={i} style={{ fontSize: "0.7rem", background: "white", color: "#06b6d4", padding: "0.2rem 0.6rem", borderRadius: "6px", border: "1px solid rgba(6, 182, 212, 0.1)", fontWeight: "600" }}>{r.trim()}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: activeRoadmapId ? "1000px" : "1200px", margin: "0 auto", paddingBottom: "3rem" }}
    >
      {/* --------------------------------------------------------------------------------- */}
      {/* VIEW 1: ROADMAP LIST (GRID) */}
      {/* --------------------------------------------------------------------------------- */}
      {!activeRoadmapId && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Route size={32} color="#ec4899" /> My Roadmaps
              </h2>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>Create and track custom step-by-step journeys for your goals.</p>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search roadmaps..." 
                  style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "100px", background: "var(--bg-color)", border: "1px solid var(--card-border)", color: "var(--text-color)", outline: "none", width: "250px" }} 
                />
              </div>
              <button onClick={() => setIsAddingRoadmap(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#ec4899", color: "white" }}>
                <Plus size={20} /> Create Roadmap
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none", marginBottom: "0.5rem" }}>
            {["All", "In Progress", "Completed"].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                style={{ 
                  padding: "0.5rem 1.2rem", 
                  borderRadius: "100px", 
                  border: filter === f ? "none" : "1px solid var(--card-border)", 
                  background: filter === f ? "#ec4899" : "var(--bg-color)", 
                  color: filter === f ? "white" : "var(--text-color)", 
                  cursor: "pointer", 
                  fontWeight: "600", 
                  fontSize: "0.9rem", 
                  transition: "all 0.2s" 
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {roadmaps.filter(rm => {
              const p = getProgress(rm.steps);
              const statusMatch = filter === "All" ? true : filter === "Completed" ? p === 100 : p < 100;
              const searchMatch = rm.title.toLowerCase().includes(searchQuery.toLowerCase());
              return statusMatch && searchMatch;
            }).map((rm, i) => (
              <motion.div variants={itemVariants} key={rm.id}>
                <div 
                  onClick={() => setActiveRoadmapId(rm.id)}
                  style={{ 
                    background: "var(--card-bg)", 
                    border: "1px solid var(--card-border)", 
                    borderRadius: "24px", 
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    height: "100%"
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ 
                      width: "50px", 
                      height: "50px", 
                      borderRadius: "16px", 
                      background: `${rm.iconColor}15`, 
                      color: rm.iconColor,
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}>
                      <Map size={24} />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={(e) => { e.stopPropagation(); deleteRoadmap(rm.id); }} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", transition: "all 0.2s", borderRadius: "8px", padding: "0.2rem", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseOver={e=>e.currentTarget.style.background='#ef444415'} onMouseOut={e=>e.currentTarget.style.background='transparent'} title="Delete Roadmap">
                        <Trash2 size={20} />
                      </button>
                      <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", lineHeight: "1.3" }}>{rm.title}</h3>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5" }}>{rm.desc}</p>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--card-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-muted)" }}>
                      <span>{getProgress(rm.steps)}% Complete</span>
                      <span>{rm.steps.length} Steps</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "var(--bg-color)", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ width: `${getProgress(rm.steps)}%`, height: "100%", background: rm.iconColor, borderRadius: "10px", transition: "width 0.3s" }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {roadmaps.length === 0 && (
              <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", borderRadius: "24px", border: "1px dashed var(--card-border)" }}>
                <Map size={48} color="var(--card-border)" style={{ marginBottom: "1rem" }} />
                <p style={{ margin: "0 0 1rem 0" }}>No roadmaps created yet.</p>
                <button onClick={() => setIsAddingRoadmap(true)} style={{ background: "#6366f1", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "100px", cursor: "pointer", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <Plus size={18} /> Create Roadmap
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={24} color="#f59e0b" /> Recommended Templates
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {ELITE_TEMPLATES.map((template) => (
                <div key={template.id} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${template.color}15`, color: template.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Route size={20} />
                    </div>
                    <button 
                      onClick={() => handleStartTemplate(template)}
                      style={{ padding: "0.5rem 1rem", borderRadius: "100px", border: "none", background: template.color, color: "white", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer" }}
                    >
                      Start This Path
                    </button>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>{template.title}</h4>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>{template.desc}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "600" }}>
                    <span>{template.steps.length} Expert Steps</span>
                    <span>•</span>
                    <span>Includes Resources</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* VIEW 2: ROADMAP DETAILS (STEPS) */}
      {/* --------------------------------------------------------------------------------- */}
      {activeRoadmapId && activeRoadmap && (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <button 
                onClick={() => setActiveRoadmapId(null)} 
                style={{ background: "transparent", color: "#ec4899", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", fontSize: "0.95rem", marginBottom: "1rem", padding: "0.5rem 1rem", borderRadius: "100px", border: "1px solid #ec489950", transition: "all 0.2s" }}
                onMouseOver={e => e.currentTarget.style.background = "#ec489915"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}
              >
                <ArrowLeft size={16} /> Back to Roadmaps
              </button>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Map size={32} color={activeRoadmap.iconColor} /> {activeRoadmap.title}
              </h2>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>{activeRoadmap.desc}</p>
            </div>
            <button onClick={() => setIsAddingStep(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: activeRoadmap.iconColor, color: "white" }}>
              <Plus size={20} /> Add Step
            </button>
          </div>

          <div style={{ position: "relative", padding: "2rem 0 2rem 2rem" }}>
            {/* Vertical connecting line */}
            <div style={{ position: "absolute", left: "44px", top: "3rem", bottom: "3rem", width: "4px", background: "var(--card-border)", borderRadius: "10px" }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {activeRoadmap.steps.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", borderRadius: "20px", border: "1px dashed var(--card-border)" }}>
                  No steps in this roadmap yet. Click "Add Step" to begin!
                </div>
              )}
              {activeRoadmap.steps.map((step: any, i: number) => (
                <motion.div variants={stepVariants} key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: "2rem", position: "relative" }}>
                  
                  {/* Timeline Icon Node */}
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "50%", 
                    background: step.status === 'completed' ? "#10b981" : step.status === 'in-progress' ? activeRoadmap.iconColor : "var(--bg-color)", 
                    border: step.status === 'locked' ? "2px solid var(--card-border)" : "none",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    zIndex: 2,
                    boxShadow: step.status !== 'locked' ? "0 4px 15px rgba(0,0,0,0.1)" : "none"
                  }}>
                    {step.status === 'completed' && <CheckCircle2 color="white" size={24} />}
                    {step.status === 'in-progress' && <Flag color="white" size={22} />}
                    {step.status === 'locked' && <Lock color="var(--text-muted)" size={20} />}
                  </div>
                  
                  {/* Step Content Card */}
                  <div style={{ 
                    flex: 1, 
                    background: step.status === 'in-progress' ? `${activeRoadmap.iconColor}10` : "var(--card-bg)", 
                    border: step.status === 'in-progress' ? `1px solid ${activeRoadmap.iconColor}50` : "1px solid var(--card-border)", 
                    borderRadius: "20px", 
                    padding: "1.5rem",
                    opacity: step.status === 'locked' ? 0.6 : 1,
                    boxShadow: step.status === 'in-progress' ? `0 10px 30px ${activeRoadmap.iconColor}20` : "0 2px 10px rgba(0,0,0,0.02)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700" }}>{step.title}</h3>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: step.status === 'completed' ? "#10b981" : step.status === 'in-progress' ? activeRoadmap.iconColor : "var(--text-muted)", background: "var(--bg-color)", padding: "0.25rem 0.75rem", borderRadius: "100px", border: "1px solid var(--card-border)" }}>
                          {step.date}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); deleteStep(activeRoadmap.id, step.id); }} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.2rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }} onMouseOver={e=>e.currentTarget.style.background='#ef444415'} onMouseOut={e=>e.currentTarget.style.background='transparent'} title="Delete Step">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {renderDescription(step.desc)}
                    
                    {step.status === 'in-progress' && (
                      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                         <button onClick={() => markComplete(activeRoadmap.id, step.id)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "none", background: activeRoadmap.iconColor, color: "white", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>Mark Complete</button>
                      </div>
                    )}
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}


      {/* --------------------------------------------------------------------------------- */}
      {/* MODALS */}
      {/* --------------------------------------------------------------------------------- */}

      {/* CREATE ROADMAP MODAL */}
      <AnimatePresence>
        {isAddingRoadmap && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
              onClick={() => setIsAddingRoadmap(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "500px", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Create Roadmap</h3>
                <button onClick={() => setIsAddingRoadmap(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddRoadmap} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Roadmap Title</label>
                  <input 
                    type="text" 
                    value={newRoadmap.title}
                    onChange={(e) => setNewRoadmap({...newRoadmap, title: e.target.value})}
                    placeholder="e.g. Learn Python" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Description</label>
                  <input 
                    type="text" 
                    value={newRoadmap.desc}
                    onChange={(e) => setNewRoadmap({...newRoadmap, desc: e.target.value})}
                    placeholder="e.g. Master python programming from scratch" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Theme Color</label>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"].map(color => (
                      <div 
                        key={color}
                        onClick={() => setNewRoadmap({...newRoadmap, color})}
                        style={{ 
                          width: "30px", 
                          height: "30px", 
                          borderRadius: "50%", 
                          background: color, 
                          cursor: "pointer",
                          border: newRoadmap.color === color ? "3px solid var(--text-color)" : "3px solid transparent",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAddingRoadmap(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#ec4899" }}>Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE STEP MODAL */}
      <AnimatePresence>
        {isAddingStep && activeRoadmap && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
              onClick={() => setIsAddingStep(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "500px", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add Step to {activeRoadmap.title}</h3>
                <button onClick={() => setIsAddingStep(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddStep} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Step Title</label>
                  <input 
                    type="text" 
                    value={newStep.title}
                    onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                    placeholder="e.g. Schedule Interview" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Description</label>
                  <input 
                    type="text" 
                    value={newStep.desc}
                    onChange={(e) => setNewStep({...newStep, desc: e.target.value})}
                    placeholder="e.g. Discuss goals with counselor" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Status</label>
                    <select 
                      value={newStep.status}
                      onChange={(e) => setNewStep({...newStep, status: e.target.value})}
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", appearance: "none" }}
                    >
                      <option value="locked">Locked</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Estimated Date</label>
                    <input 
                      type="text" 
                      value={newStep.date}
                      onChange={(e) => setNewStep({...newStep, date: e.target.value})}
                      placeholder="e.g. Nov 2024" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAddingStep(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: activeRoadmap.iconColor }}>Save Step</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
