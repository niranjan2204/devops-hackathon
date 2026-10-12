"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Server, Shield, Database, Cloud, GitBranch, TerminalSquare, Container, Globe, Cpu, Blocks, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 2 + "px",
            height: Math.random() * 6 + 2 + "px",
            backgroundColor: i % 2 === 0 ? "#00f3ff" : "#ff00ea",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.2,
            boxShadow: `0 0 10px ${i % 2 === 0 ? "#00f3ff" : "#ff00ea"}`,
          }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            x: [0, Math.random() * 40 - 20],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    let interval: any;
    
    fetch(`${API_BASE_URL}/api/config`)
      .then(res => res.json())
      .then(data => {
        if (data && data.hackathonStart) {
          const targetDate = new Date(data.hackathonStart);
          
          interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            
            if (difference <= 0) {
              clearInterval(interval);
              setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
              return;
            }
            
            setTimeLeft({
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
            });
          }, 1000);
        }
      });

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex justify-center gap-2 sm:gap-4 md:gap-8 text-center mt-6 sm:mt-10 px-2">
      {[
        { label: "Days", value: timeLeft.days, color: "from-[#00f3ff] to-[#0088ff]" },
        { label: "Hours", value: timeLeft.hours, color: "from-[#ff00ea] to-[#9d00ff]" },
        { label: "Minutes", value: timeLeft.minutes, color: "from-[#fbff00] to-[#ffaa00]" },
        { label: "Seconds", value: timeLeft.seconds, color: "from-[#00ff73] to-[#00aa55]" }
      ].map((unit, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-32 flex items-center justify-center rounded-xl sm:rounded-2xl mb-2 sm:mb-4 relative overflow-hidden group border border-white/20 shadow-2xl">
            {/* Image background for cards */}
            <div className="absolute inset-0 bg-[url('/devops-bg.png')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500 blur-sm"></div>
            <div className="absolute inset-0 bg-black/50"></div>
            
            <div className={`absolute inset-0 bg-gradient-to-br ${unit.color} opacity-20 mix-blend-overlay`}></div>
            <span className={`relative z-10 text-2xl sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br ${unit.color} drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]`}>
              {unit.value.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-gray-300 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.1em] sm:tracking-[0.2em] uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function DevOpsOrbit() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const icons = [
    { icon: <Container className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#00f3ff]" />, label: "Docker" },
    { icon: <Blocks className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#ff00ea]" />, label: "Kubernetes" },
    { icon: <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#fbff00]" />, label: "Git" },
    { icon: <Cloud className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#00ff73]" />, label: "AWS" },
    { icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />, label: "CI/CD" },
    { icon: <TerminalSquare className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#9d00ff]" />, label: "Linux" },
  ];

  const radius = isMobile ? 120 : 220;

  return (
    <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[450px] md:max-w-[600px] flex items-center justify-center mx-auto my-4 sm:my-0">
      {/* Central Hub Image */}
      <motion.div 
        animate={{ 
          boxShadow: ["0 0 20px #00f3ff", "0 0 50px #ff00ea", "0 0 20px #00f3ff"],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="w-32 h-32 sm:w-44 sm:h-44 md:w-64 md:h-64 rounded-full z-10 relative flex items-center justify-center p-1.5 sm:p-2 bg-black/40 backdrop-blur-xl border border-white/20"
      >
        <motion.img 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          src="/hub.png" 
          alt="DevOps Hub" 
          className="w-full h-full object-cover rounded-full drop-shadow-[0_0_20px_#00f3ff]"
        />
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
      </motion.div>

      {/* Orbiting Icons */}
      {icons.map((item, i) => {
        return (
          <motion.div
            key={i}
            className="absolute z-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: -(25 / icons.length) * i }}
            style={{ width: radius * 2, height: radius * 2 }}
          >
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            >
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: -(25 / icons.length) * i }}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center relative overflow-hidden group border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-110 transition-all bg-black/80 backdrop-blur-md"
              >
                {/* Backing image inside the rotating cards */}
                <div className="absolute inset-0 bg-[url('/devops-bg.png')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
                <div className="relative z-10">{item.icon}</div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* Complex Rings */}
      <div className="absolute inset-[-10px] sm:inset-[-20px] border-2 border-white/10 rounded-full animate-[spin_40s_linear_infinite]"></div>
      <div className="absolute inset-[10px] sm:inset-[20px] border border-white/5 rounded-full animate-[spin_25s_linear_infinite_reverse]"></div>
      <div className="absolute inset-[30px] sm:inset-[60px] border-2 border-[#00f3ff]/20 rounded-full animate-[spin_15s_linear_infinite] border-dashed"></div>
      <div className="absolute inset-[50px] sm:inset-[100px] border border-[#ff00ea]/20 rounded-full animate-[spin_10s_linear_infinite_reverse] border-dotted"></div>
    </div>
  );
}

export default function Home() {
  const [maxTeams, setMaxTeams] = useState(30);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/config`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.maxTeams) {
            setMaxTeams(data.maxTeams);
          }
          if (data.isRegistrationClosed || (data.teamCount !== undefined && data.teamCount >= (data.maxTeams || 30))) {
            setIsClosed(true);
          }
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="w-full flex flex-col items-center overflow-hidden relative">
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 pt-12 sm:pt-20 md:pt-24 pb-12 sm:pb-16 min-h-[auto] lg:min-h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left z-10 relative w-full"
        >
          {/* Decorative glowing background behind text */}
          <div className="absolute -inset-10 sm:-inset-20 bg-gradient-to-r from-[#00f3ff]/10 to-[#ff00ea]/10 blur-3xl rounded-full z-[-1]"></div>
          
          <div className="inline-block px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/10 text-[#00f3ff] font-bold text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] mb-6 sm:mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.2)]">
            BANNARI AMMAN INSTITUTE OF TECHNOLOGY
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black mb-3 sm:mb-4 tracking-tighter leading-[0.95] sm:leading-[0.9]">
            DEVSPRINT <br/>
            <span className="text-gradient drop-shadow-[0_0_20px_rgba(255,0,234,0.3)]">2026</span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-3xl text-white font-mono mb-6 sm:mb-10 font-bold tracking-wider sm:tracking-widest mt-4 sm:mt-6">
            BUILD <span className="text-[#00f3ff]">/</span> AUTOMATE <span className="text-[#ff00ea]">/</span> DEPLOY
          </p>
          
          <p className="text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-12 leading-relaxed text-sm sm:text-base md:text-lg bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10">
            A high-stakes, competitive DevOps-focused hackathon. Form your elite team of 2-3 members, solve real-world infrastructure challenges, and prove your automation supremacy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <Link href="/register" className="w-full sm:w-auto relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${isClosed ? "from-red-500 to-yellow-500 opacity-60" : "from-[#00f3ff] to-[#ff00ea] opacity-70 animate-pulse"} rounded-xl blur group-hover:opacity-100 transition duration-500`}></div>
              <button className="relative w-full sm:w-auto bg-black text-white px-6 sm:px-10 py-3.5 sm:py-5 rounded-xl font-black tracking-widest flex items-center justify-center gap-2 sm:gap-3 border border-white/20 hover:scale-105 transition-transform duration-300 text-sm sm:text-lg">
                {isClosed ? (
                  <>REGISTRATION CLOSED <TerminalSquare className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" /></>
                ) : (
                  <>REGISTER TEAM <TerminalSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#00f3ff]" /></>
                )}
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 w-full relative z-10 flex justify-center lg:justify-end overflow-hidden py-4 sm:py-0"
        >
          <DevOpsOrbit />
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="w-full py-16 sm:py-24 relative overflow-hidden">
        {/* Full width background image with parallax feel */}
        <div className="absolute inset-0 bg-[url('/devops-bg.png')] bg-cover bg-fixed bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-transparent to-[#030014]"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center z-10 relative">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-6 sm:mb-8 tracking-[0.15em] sm:tracking-[0.3em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">DEVSPRINT START TIME</h2>
          <Countdown />
        </div>
      </section>

      {/* Information Cards */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-16 sm:py-24 md:py-32 relative z-10">
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight sm:tracking-tighter drop-shadow-[0_0_30px_rgba(0,243,255,0.3)]">
            MISSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ea]">PARAMETERS</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {[
            { icon: <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-[#00f3ff]" />, title: "Squad Size", value: "2-3 Members", desc: "2 to 3 members per team required to enter." },
            { icon: <Server className="w-8 h-8 sm:w-12 sm:h-12 text-[#ff00ea]" />, title: "Capacity", value: `${maxTeams} Teams`, desc: "Strictly limited slots. First come, first served." },
            { icon: <Database className="w-8 h-8 sm:w-12 sm:h-12 text-[#fbff00]" />, title: "Challenges", value: "Atomic Lock", desc: "Select a problem. Once claimed, it's yours." },
            { icon: <Cloud className="w-8 h-8 sm:w-12 sm:h-12 text-[#00ff73]" />, title: "Deployment", value: "Live Servers", desc: "Test your skills on real cloud infrastructure." },
            { icon: <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-[#9d00ff]" />, title: "Rewards", value: "Reward Points", desc: "First come, first serve. Winners will receive rewards points." },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative rounded-2xl sm:rounded-3xl group overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              {/* Image Background */}
              <div className="absolute inset-0 bg-[url('/devops-bg.png')] bg-cover bg-center opacity-30 group-hover:opacity-60 transition-opacity duration-500 scale-110 group-hover:scale-125 transform"></div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
              
              <div className="relative p-5 sm:p-8 h-full flex flex-col justify-end z-10 pt-20 sm:pt-28 md:pt-32">
                <div className="absolute top-5 sm:top-8 right-5 sm:right-8 p-2.5 sm:p-4 bg-black/50 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 group-hover:border-[#00f3ff]/50 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  {item.icon}
                </div>
                <h3 className="text-[#00f3ff] text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-4">{item.value}</p>
                <p className="text-gray-300 text-xs sm:text-base leading-relaxed font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
