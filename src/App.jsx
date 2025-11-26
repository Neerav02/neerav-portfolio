import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Server, 
  Database, 
  Code, 
  Terminal, 
  Cpu, 
  Globe, 
  BookOpen, 
  Award,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Send,
  Bot,
  Loader2,
  Minimize2,
  Briefcase,
  Copy,
  Check,
  Activity,
  Zap,
  TrendingUp,
  AlertTriangle,
  Play,
  Brain,
  Download,
  Coffee,
  GitCommit,
  Bug
} from 'lucide-react';

// --- RESUME CONTEXT FOR GEMINI ---
const RESUME_CONTEXT = `
You are an AI assistant for Neerav Babel's portfolio website. Your goal is to professionally and enthusiastically represent Neerav to recruiters and technical interviewers.
Answer questions based STRICTLY on the following resume context. If you don't know the answer based on this context, say you don't know but suggest contacting him directly.

**Profile:**
- Name: Neerav Babel
- Role: Full Stack & Backend Developer
- Location: Bangalore, India
- Email: babelneerav299@gmail.com
- Summary: Results-oriented Full Stack & Backend Developer. Expert in scalable microservices, high-performance web systems, Python, and MERN stack. Skilled in asynchronous systems and container deployment.

**Projects:**
1. **EchoQuery (Oct 2025 - Nov 2025):** - *Role:* Backend/System Architect
   - *Tech:* Python, FastAPI, Docker, Celery, RabbitMQ, PostgreSQL, MinIO.
   - *Key Problem:* API crashes during heavy AI tasks.
   - *Solution:* Built microservices architecture. Offloaded slow AI calculations to background queues (RabbitMQ/Celery). Used MinIO (S3) for heavy media storage to unblock the main DB.
   
2. **Waggy - The Pet Shop (Jan 2025 - Apr 2025):**
   - *Role:* Full Stack Developer
   - *Tech:* Python, Flask, MongoDB, JavaScript.
   - *Key Problem:* Overselling items and UI freezing.
   - *Solution:* Implemented atomic database updates for inventory consistency. Moved GPS tracking updates to background threads/processes.

**Technical Skills:**
- **Languages:** Python, JavaScript, HTML5, CSS3.
- **Frameworks:** FastAPI, Flask, React.js, Node.js.
- **Databases:** PostgreSQL, MongoDB, MySQL, MinIO (Object Storage).
- **Tools/DevOps:** Docker, Docker Compose, Kubernetes, RabbitMQ, Celery, Git, GitHub.
- **Soft Skills:** Problem Solving, Technical Communication, Critical Thinking, Adaptability, Result Oriented.

**Education:**
- B.Tech in Computer Science & Engineering, Jain (Deemed-to-be) University, Bangalore.
- CGPA: 9.25/10.0 (Aug 2023 - May 2027).
- Coursework: DBMS, OS, Data Structures & Algorithms.

**Research:**
- Publication: "Crypto Seer" - A Cryptocurrency Price Prediction Tool.
- Venue: IEEE OTCON 4.0 (2025).
- Topic: Predictive modeling for financial markets.

**Tone:** Professional, confident, concise, and helpful. Use "Neerav" or "he" when referring to the developer.
`;

const Portfolio = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- AI CHAT STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: "Hi! I'm Neerav's AI Assistant. Ask me anything about his projects, skills, or experience! ✨" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  // --- RECRUITER OUTREACH STATE ---
  const [recruiterData, setRecruiterData] = useState({ company: '', role: '' });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- ARCHITECTURE SIMULATION STATE ---
  const [simState, setSimState] = useState({
    queueDepth: 0,
    activeWorkers: 1,
    requestsProcessed: 0,
    apiStatus: 'Healthy',
    dbLoad: 10
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simAnalysis, setSimAnalysis] = useState('');
  const [isAnalyzingSim, setIsAnalyzingSim] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // --- SIMULATION LOGIC ---
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimState(prev => {
          // Workers process items
          const processed = Math.min(prev.queueDepth, prev.activeWorkers * 5); // 5 tasks per worker per tick
          const newQueue = Math.max(0, prev.queueDepth - processed);
          
          return {
            ...prev,
            queueDepth: newQueue,
            requestsProcessed: prev.requestsProcessed + processed,
            dbLoad: Math.max(10, Math.min(100, (processed * 2) + 10)), // DB load correlates to processing
            apiStatus: newQueue > 500 ? 'Degraded' : 'Healthy'
          };
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleSimAction = (action) => {
    if (!isSimulating) setIsSimulating(true);
    
    if (action === 'spike') {
      setSimState(prev => ({ ...prev, queueDepth: prev.queueDepth + 200 }));
    } else if (action === 'add_worker') {
      setSimState(prev => ({ ...prev, activeWorkers: Math.min(5, prev.activeWorkers + 1) }));
    } else if (action === 'kill_worker') {
      setSimState(prev => ({ ...prev, activeWorkers: Math.max(0, prev.activeWorkers - 1) }));
    }
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- GEMINI API: CHAT ---
  const handleSendMessage = async (textOverride) => {
    const textToSend = textOverride || userInput;
    if (!textToSend.trim()) return;

    // Add user message to UI
    const newMessages = [...chatMessages, { role: 'user', text: textToSend }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsGenerating(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;; // API Key injected by environment
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: newMessages.map(m => ({
              role: m.role === 'model' ? 'model' : 'user',
              parts: [{ text: m.text }]
            })),
            systemInstruction: { parts: [{ text: RESUME_CONTEXT }] }
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now.";
      setChatMessages(prev => [...prev, { role: 'model', text: botResponse }]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "⚠️ Oops! I couldn't reach the server." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- GEMINI API: SMART EMAIL DRAFTER ---
  const handleDraftEmail = async () => {
    if (!recruiterData.company || !recruiterData.role) return;
    
    setIsDrafting(true);
    setGeneratedEmail('');

    try {
      const apiKey = ""; // API Key injected by environment
      const prompt = `
        Act as a professional recruiter from ${recruiterData.company} hiring for a ${recruiterData.role}.
        Write a compelling, personalized outreach email to Neerav Babel.
        
        CRITICAL INSTRUCTIONS:
        1. Analyze Neerav's resume context provided below.
        2. Pick 2-3 specific skills or projects (like EchoQuery, Waggy, Python, RabbitMQ) that strongly match a ${recruiterData.role} role.
        3. Explain WHY those specific skills make him a good fit for ${recruiterData.company}.
        4. Keep it concise (under 150 words), professional, and exciting.
        5. Subject line should be catchy.
        
        Resume Context: ${RESUME_CONTEXT}
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const draft = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate draft.";
      setGeneratedEmail(draft);

    } catch (error) {
      console.error("Gemini API Error:", error);
      setGeneratedEmail("Error generating email. Please try again.");
    } finally {
      setIsDrafting(false);
    }
  };

  // --- GEMINI API: ANALYZE SIMULATION ---
  const handleAnalyzeSim = async () => {
    setIsAnalyzingSim(true);
    setSimAnalysis('');
    
    try {
      const apiKey = ""; // API Key injected by environment
      const prompt = `
        You are a Senior System Architect. Analyze this live simulation state from Neerav's portfolio architecture demo (based on his EchoQuery project):
        
        Current State:
        - Queue Depth (RabbitMQ): ${simState.queueDepth}
        - Active Workers (Celery): ${simState.activeWorkers}
        - API Status: ${simState.apiStatus}
        - DB Load: ${simState.dbLoad}%
        
        Provide a 2-sentence technical commentary for a recruiter viewing this.
        If queue is high, explain how RabbitMQ is saving the system.
        If workers are low, explain the need for scaling.
        If system is healthy, praise the efficiency.
        Mention "Neerav's architecture" in the third person.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        }
      );

      const data = await response.json();
      const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis unavailable.";
      setSimAnalysis(analysis);
    } catch (error) {
      setSimAnalysis("Could not analyze simulation.");
    } finally {
      setIsAnalyzingSim(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openChatWithQuery = (query) => {
    setIsChatOpen(true);
    handleSendMessage(query);
  };

  const skills = {
    languages: ["Python", "JavaScript", "HTML5", "CSS3"],
    frameworks: ["FastAPI", "Flask", "React.js", "Node.js"],
    databases: ["PostgreSQL", "MongoDB", "MySQL", "MinIO"],
    tools: ["Docker", "Kubernetes", "RabbitMQ", "Celery", "Git"],
    softSkills: ["Problem Solving", "Technical Communication", "Critical Thinking", "Adaptability", "Result Oriented"]
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-800' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            NB.
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {['About', 'Skills', 'Projects', 'Architecture', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-cyan-400 transition-colors uppercase tracking-wider text-xs"
              >
                {item}
              </button>
            ))}
            {/* Resume Download Button */}
            <a 
              href="/resume.pdf" 
              download
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:border-cyan-500/50"
            >
              <Download size={14} /> Resume
            </a>
          </div>

          <button 
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 px-6 py-4 space-y-4">
            {['About', 'Skills', 'Projects', 'Architecture', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="block w-full text-left text-sm font-medium hover:text-cyan-400"
              >
                {item}
              </button>
            ))}
             <a 
              href="/resume.pdf" 
              download
              className="block w-full text-left text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
            >
              <Download size={14} /> Download Resume
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="about" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 text-sm mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Open to Work</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Hi, I'm <span className="text-white">Neerav Babel</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Full Stack & Backend Developer crafting scalable microservices and high-performance web systems.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => scrollToSection('architecture')}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              See Architecture <Server size={18} />
            </button>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
            >
              <Sparkles size={18} /> Ask AI About Me
            </button>
          </div>

          <div className="mt-16 flex justify-center gap-6 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Github size={24} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin size={24} /></a>
            <a href="mailto:babelneerav299@gmail.com" className="hover:text-white transition-colors"><Mail size={24} /></a>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <Terminal className="text-cyan-400" size={32} />
            <h2 className="text-3xl font-bold text-white">Technical Arsenal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Languages */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Code className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Frameworks */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Databases */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Databases</h3>
              <div className="flex flex-wrap gap-2">
                {skills.databases.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Server className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Architecture</h3>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.softSkills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <Cpu className="text-cyan-400" size={32} />
            <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
          </div>

          <div className="space-y-12">
            {/* Project 1 */}
            <div className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">EchoQuery</h3>
                      <p className="text-cyan-400 font-medium">Asynchronous AI Media Architecture</p>
                    </div>
                    <span className="text-slate-500 text-sm">Oct 2025 - Nov 2025</span>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Designed a high-speed microservices architecture to process heavy AI workloads without compromising user experience. 
                    Implemented background processing for computationally expensive tasks using RabbitMQ and Celery.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-auto items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {["Python", "FastAPI", "Docker", "Celery", "RabbitMQ", "PostgreSQL", "MinIO"].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-900/50 text-cyan-200 text-xs rounded border border-cyan-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => openChatWithQuery("Tell me about the architecture of EchoQuery and why he used RabbitMQ.")}
                      className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30 px-3 py-1.5 rounded-full hover:bg-purple-500/10"
                    >
                      <Sparkles size={12} /> Ask AI about this
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Waggy - The Pet Shop</h3>
                      <p className="text-orange-400 font-medium">Full Stack E-commerce Platform</p>
                    </div>
                    <span className="text-slate-500 text-sm">Jan 2025 - Apr 2025</span>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Developed a robust E-commerce solution with real-time tracking capabilities. 
                    Focused on data integrity and high-concurrency handling for inventory management.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-auto items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {["Python", "Flask", "MongoDB", "JavaScript", "HTML/CSS"].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-900/50 text-orange-200 text-xs rounded border border-orange-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => openChatWithQuery("How did Neerav handle concurrency in the Waggy project?")}
                      className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30 px-3 py-1.5 rounded-full hover:bg-purple-500/10"
                    >
                      <Sparkles size={12} /> Ask AI about this
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE ARCHITECTURE LAB --- */}
      <section id="architecture" className="py-24 bg-slate-950 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Activity className="text-cyan-400" size={32} />
              <div>
                <h2 className="text-3xl font-bold text-white">Live Architecture Lab</h2>
                <p className="text-slate-400 text-sm mt-1">Interactive simulation of the <span className="text-cyan-400">EchoQuery</span> microservices design.</p>
              </div>
            </div>
            <div className="hidden md:block bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-xs text-slate-500">
              <span className="w-2 h-2 inline-block rounded-full bg-green-500 mr-2 animate-pulse"></span>
              System Online
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Visualizer Panel */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 opacity-50"></div>
              
              {/* Architecture Diagram */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative z-10 h-[300px]">
                
                {/* 1. Client */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-slate-800 border-2 border-slate-600 rounded-full flex items-center justify-center relative">
                    <Globe className="text-slate-400" />
                    {simState.queueDepth > 0 && <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex space-x-1 animate-pulse"><div className="w-1 h-1 bg-cyan-400 rounded-full"></div><div className="w-1 h-1 bg-cyan-400 rounded-full"></div></div>}
                  </div>
                  <span className="text-xs font-mono text-slate-400">Clients</span>
                </div>

                {/* Arrow */}
                <div className="h-[2px] w-12 bg-slate-700 relative overflow-hidden hidden md:block">
                   <div className={`absolute top-0 left-0 h-full w-full bg-cyan-500/50 ${simState.queueDepth > 0 ? 'animate-progress' : 'hidden'}`}></div>
                </div>

                {/* 2. API Gateway */}
                <div className={`flex flex-col items-center gap-2 transition-transform duration-200 ${simState.queueDepth > 400 ? 'scale-95 opacity-80' : ''}`}>
                  <div className={`w-20 h-20 bg-slate-800 border-2 ${simState.apiStatus === 'Degraded' ? 'border-red-500 shadow-red-500/20' : 'border-cyan-500 shadow-cyan-500/20'} rounded-lg flex flex-col items-center justify-center shadow-lg`}>
                    <Server className={simState.apiStatus === 'Degraded' ? 'text-red-400' : 'text-cyan-400'} />
                    <span className="text-[10px] mt-1 text-slate-500">FastAPI</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">API Gateway</span>
                  {simState.apiStatus === 'Degraded' && <span className="text-[10px] text-red-400 font-bold animate-pulse">BACKPRESSURE</span>}
                </div>

                 {/* Arrow */}
                 <div className="h-[2px] w-12 bg-slate-700 hidden md:block"></div>

                {/* 3. Message Queue */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 bg-slate-800 border-2 border-orange-500/50 rounded-lg flex flex-col items-center justify-center relative shadow-lg shadow-orange-500/10">
                    <Database className="text-orange-400" size={20} />
                    <span className="text-[10px] mt-2 text-slate-500">RabbitMQ</span>
                    <div className="w-16 h-2 bg-slate-700 mt-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-300" 
                        style={{ width: `${Math.min(100, (simState.queueDepth / 600) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono text-orange-300 mt-1">{simState.queueDepth} msgs</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Message Queue</span>
                </div>

                 {/* Arrow */}
                 <div className="h-[2px] w-12 bg-slate-700 hidden md:block"></div>

                {/* 4. Workers */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-12 rounded-sm transition-all duration-300 ${i < simState.activeWorkers ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-800 border border-slate-700'}`}
                      ></div>
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-green-400 font-bold">{simState.activeWorkers} Active</div>
                    <span className="text-xs font-mono text-slate-400">Celery Workers</span>
                  </div>
                </div>

                {/* 5. DB */}
                <div className="absolute top-4 right-4 md:static md:top-auto md:right-auto flex flex-col items-center gap-2 opacity-50">
                  <Database size={16} />
                  <span className="text-[10px]">DB</span>
                </div>

              </div>

              {/* Simulation Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800">
                <button 
                  onClick={() => handleSimAction('spike')}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Zap size={14} /> Simulate Spike
                </button>
                <button 
                  onClick={() => handleSimAction('add_worker')}
                  className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <TrendingUp size={14} /> Add Worker
                </button>
                <button 
                  onClick={() => handleSimAction('kill_worker')}
                  className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold rounded border border-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <AlertTriangle size={14} /> Kill Worker
                </button>
                 <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950 rounded border border-slate-800">
                   <Activity size={14} className="text-blue-400"/>
                   <span>Processed: {simState.requestsProcessed}</span>
                 </div>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Bot className="text-purple-400" />
                <h3 className="font-bold text-white">AI Architect Analysis</h3>
              </div>
              
              <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-800 mb-4 overflow-y-auto text-sm text-slate-300 leading-relaxed">
                {isAnalyzingSim ? (
                  <div className="flex items-center justify-center h-full gap-2 text-purple-400">
                    <Loader2 className="animate-spin" /> Analyzing metrics...
                  </div>
                ) : simAnalysis ? (
                  <div className="animate-fade-in">
                    <p className="text-purple-300 font-semibold mb-2 text-xs uppercase tracking-wider">Analysis Report</p>
                    {simAnalysis}
                  </div>
                ) : (
                  <div className="text-slate-500 flex flex-col items-center justify-center h-full text-center">
                    <Activity className="mb-2 opacity-20" size={32} />
                    <p>Run the simulation and click Analyze to get an AI breakdown of the system performance.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleAnalyzeSim}
                disabled={isAnalyzingSim}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Analyze Current State
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: CODING ANALYTICS SECTION --- */}
      <section className="py-20 bg-slate-800/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <Activity className="text-cyan-400" size={32} />
            <h2 className="text-3xl font-bold text-white">Coding Activity & Analytics</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* 1. LeetCode Stats */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Code size={100} />
               </div>
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 LeetCode Stats 
                 <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full border border-yellow-500/20">Top 15%</span>
               </h3>
               
               <div className="flex items-center gap-6">
                 {/* CSS Donut Chart */}
                 <div className="relative w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                      {/* Hard (15%) */}
                      <path className="text-red-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 14.5 9" fill="none" stroke="currentColor" strokeWidth="3.8" />
                      {/* Medium (50%) */}
                      <path className="text-yellow-500" d="M32.5 11 a 15.9155 15.9155 0 0 1 -14.5 27" fill="none" stroke="currentColor" strokeWidth="3.8" strokeDasharray="50, 100" />
                      {/* Easy (35%) */}
                      <path className="text-green-500" d="M18 38 a 15.9155 15.9155 0 0 1 -16 -16" fill="none" stroke="currentColor" strokeWidth="3.8" strokeDasharray="35, 100" />
                    </svg>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">105</div>
                      <div className="text-[10px] text-slate-400 uppercase">Solved</div>
                    </div>
                 </div>
                 
                 <div className="space-y-3 flex-1">
                   <div className="flex justify-between text-sm"><span className="text-green-400">Easy</span> <span className="text-white font-mono">40</span></div>
                   <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-[40%] h-full bg-green-500 rounded-full"></div></div>
                   
                   <div className="flex justify-between text-sm"><span className="text-yellow-400">Medium</span> <span className="text-white font-mono">50</span></div>
                   <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-[50%] h-full bg-yellow-500 rounded-full"></div></div>

                   <div className="flex justify-between text-sm"><span className="text-red-400">Hard</span> <span className="text-white font-mono">15</span></div>
                   <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-[15%] h-full bg-red-500 rounded-full"></div></div>
                 </div>
               </div>
            </div>

            {/* 2. GitHub Activity Heatmap (Mocked) */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><GitCommit size={20}/> Contribution Graph</h3>
                <span className="text-xs text-green-400">300 commits / year</span>
              </div>
              
              <div className="flex gap-1 flex-wrap justify-center opacity-80">
                {[...Array(84)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-sm ${
                      Math.random() > 0.7 ? 'bg-green-500' : 
                      Math.random() > 0.4 ? 'bg-green-500/50' : 
                      Math.random() > 0.2 ? 'bg-green-500/20' : 'bg-slate-800'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 justify-end">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-500/20 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-500/50 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                </div>
                <span>More</span>
              </div>
            </div>

            {/* 3. Fun Backend Metrics */}
            <div className="grid grid-rows-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-cyan-500/50 transition-colors">
                <div className="bg-orange-500/10 p-3 rounded-lg"><Coffee className="text-orange-400" /></div>
                <div>
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-xs text-slate-400">Caffeine Level</div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-cyan-500/50 transition-colors">
                <div className="bg-blue-500/10 p-3 rounded-lg"><Bug className="text-blue-400" /></div>
                <div>
                  <div className="text-2xl font-bold text-white">Zero</div>
                  <div className="text-xs text-slate-400">Critical Bugs in Prod</div>
                </div>
              </div>

               <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-cyan-500/50 transition-colors">
                <div className="bg-purple-500/10 p-3 rounded-lg"><Activity className="text-purple-400" /></div>
                <div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-xs text-slate-400">Uptime Goal</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Research & Education */}
      <section id="research" className="py-20 bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            
            <div>
              <div className="flex items-center gap-4 mb-8">
                <BookOpen className="text-cyan-400" size={28} />
                <h2 className="text-2xl font-bold text-white">Research</h2>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-cyan-500 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-2">Crypto Seer</h3>
                <p className="text-slate-400 text-sm mb-4">Presented at IEEE OTCON 4.0 (2025)</p>
                <p className="text-slate-300 mb-4">
                  Authored and presented a Cryptocurrency Price Prediction Tool demonstrating advanced predictive modeling techniques for financial markets.
                </p>
                <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  <Award size={16} />
                  <span>IEEE Publication</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-8">
                <Award className="text-cyan-400" size={28} />
                <h2 className="text-2xl font-bold text-white">Education</h2>
              </div>
              <div className="relative border-l border-slate-700 ml-3 space-y-8 pl-8">
                <div className="relative">
                  <div className="absolute -left-[39px] bg-slate-900 border border-slate-700 p-1.5 rounded-full">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white">B.Tech - Computer Science</h3>
                  <p className="text-cyan-400">Jain (Deemed-to-be) University</p>
                  <p className="text-slate-500 text-sm mb-2">Aug 2023 - May 2027</p>
                  <p className="text-slate-300 font-medium">CGPA: 9.25 / 10.0</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[39px] bg-slate-900 border border-slate-700 p-1.5 rounded-full">
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-bold text-white">Certifications</h3>
                  <ul className="text-slate-400 text-sm mt-2 space-y-1">
                    <li>• Meta Full-Stack Developer</li>
                    <li>• FreeCodeCamp Full Stack Certification</li>
                    <li>• 100+ LeetCode Problems Solved</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section WITH RECRUITER MODE */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: General Contact */}
            <div className="text-left">
              <h2 className="text-4xl font-bold text-white mb-6">Let's Connect</h2>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                I'm currently looking for new opportunities. Whether you have a question about my research, my code, or just want to say hi, my inbox is open.
              </p>
              
              <div className="flex flex-col gap-4 items-start">
                <a 
                  href="mailto:babelneerav299@gmail.com"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-cyan-500/25 w-full md:w-auto justify-center"
                >
                  <Mail size={24} />
                  Say Hello
                </a>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-lg border border-slate-700 w-full md:w-auto justify-center"
                >
                  <MessageSquare size={24} className="text-purple-400"/>
                  Chat with AI
                </button>
              </div>

              <div className="mt-8 flex gap-6 text-slate-500">
                <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Github size={20}/> GitHub</a>
                <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Linkedin size={20}/> LinkedIn</a>
              </div>
            </div>

            {/* Right: Smart Email Drafter */}
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-8 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <Sparkles className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Recruiting?</h3>
                  <p className="text-sm text-slate-400">Let AI draft your outreach email to Neerav.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Company Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Google, Startup Inc."
                    value={recruiterData.company}
                    onChange={(e) => setRecruiterData({...recruiterData, company: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Role Hiring For</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Backend Engineer, Full Stack Dev"
                    value={recruiterData.role}
                    onChange={(e) => setRecruiterData({...recruiterData, role: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                  />
                </div>

                <button 
                  onClick={handleDraftEmail}
                  disabled={isDrafting || !recruiterData.company || !recruiterData.role}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isDrafting ? <Loader2 className="animate-spin" size={20} /> : <Briefcase size={20} />}
                  {isDrafting ? 'Drafting...' : 'Generate Personalized Email'}
                </button>

                {generatedEmail && (
                  <div className="mt-6 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-green-400 font-medium">✨ Draft Generated</span>
                      <button 
                        onClick={copyToClipboard}
                        className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      >
                        {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy Text'}
                      </button>
                    </div>
                    <textarea 
                      readOnly
                      value={generatedEmail}
                      className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 leading-relaxed focus:outline-none resize-none custom-scrollbar"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FLOATING CHAT WIDGET --- */}
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none`}>
        {/* Chat Window */}
        <div className={`mb-4 w-[350px] md:w-[400px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0'}`}>
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Neerav's AI Assistant</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
              <Minimize2 size={18} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700">
                  <Loader2 size={16} className="animate-spin text-purple-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about my skills..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 placeholder-slate-500"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={isGenerating || !userInput.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="pointer-events-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-lg shadow-purple-500/30 transition-all hover:scale-110 group relative"
          >
            <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-bounce" size={16} fill="currentColor" />
            <MessageSquare size={24} />
          </button>
        )}
      </div>

       {/* System Status Footer */}
       <footer className="bg-slate-950 border-t border-slate-800/50 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              All Systems Operational
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span>Latency: 24ms</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span>Region: AP-SOUTH-1</span>
          </div>
          <div>
            © 2025 Neerav Babel. Built with React & Tailwind.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Portfolio;