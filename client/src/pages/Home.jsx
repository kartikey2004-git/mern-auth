/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

import UserCard from "@/components/UserCard";
import FeaturesCard from "@/components/Features";
import Faqs from "@/components/Faqs";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

const Home = () => {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full text-white font-sans overflow-x-hidden">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-20 py-20 items-center">
        <motion.div
          className="space-y-6 max-w-xl"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.span
            className="inline-block text-sm  text-white px-4 py-1.5 rounded-full shadow-[0_2px_12px_rgba(255,255,255,0.05)] transition-all duration-200"
            variants={fadeUp}
            custom={0.2}
          >
            AI-Powered Job Discovery
          </motion.span>

          <motion.h2
            className="text-[36px] sm:text-[48px] lg:text-[54px] leading-tight text-purple-400"
            variants={fadeUp}
            custom={0.3}
          >
            Find The Right Job. <br /> Build Smarter Resumes. <br /> Analyze
            Instantly.
          </motion.h2>

          <motion.p
            className="text-white/70 text-base"
            variants={fadeUp}
            custom={0.4}
          >
            JobConnect helps you discover tech/startup jobs, build ATS-friendly
            resumes, and analyze your resume using AI. Fast. Smart. Free.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            variants={fadeUp}
            custom={0.5}
          >
            <button 
            onClick={() => navigate("/auth")}
            className="px-5 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-200">
              Get Started
            </button>
            <button className="border border-white/30 hover:border-white text-white/80 hover:text-white px-6 py-2 rounded-md text-sm">
              Try Resume Builder
            </button>
          </motion.div>
        </motion.div>

        {/* Code Editor Look */}
        <motion.div
          className="w-full max-w-[700px] mx-auto lg:mx-0 px-4 lg:px-0"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-[900px] h-[600px] bg-[#0a0a1a]/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)]  ml-16">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1b1b2f] border-b border-white/10">
              <div className="flex space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <span className="text-white/60 text-xs font-mono">resume.ai</span>
            </div>
            <div className="flex px-4 py-2 text-xs font-mono text-white/60 bg-[#13132a] border-b border-white/10 space-x-4">
              <div className="text-cyan-400">builder.js</div>
              <div className="text-pink-400">analyzer.js</div>
              <div className="text-purple-300">results.json</div>
            </div>

            <div className="px-4 py-4 font-mono text-xs text-purple-300 whitespace-pre overflow-auto h-full leading-tight ">
              {`const resume = createResume({
name: "You",
email: "you@example.com",
phone: "+91-9876543210",
skills: ["React", "MongoDB", "Node.js",       "Express", "TailwindCSS"],
experience: [
  {
    company: "Techify",
    role: "Frontend Developer",
    duration: "Jan 2023 - May 2024"
  }
],
  education: {
    degree: "B.Tech Computer Science",
    institution: "ABES Engineering College",
    year: 2024
  },
  optimized: true
})

const result = analyze(resume)

if (result.score >= 85) {
  console.log("✅ Resume is highly optimized!");
} else {
  console.warn("⚠️ Consider improving keywords or formatting.");
  console.log("Suggestions:", result.suggestions);
}

upload(resume)
  .then(res => console.log("Resume uploaded:", res.url))
  .catch(err => console.error("Upload failed:", err));
`}
            </div>
          </div>
        </motion.div>
      </section>

      <UserCard />
      <FeaturesCard />

      <Faqs />
      <footer className="px-6 lg:px-20 py-6  text-base text-center  text-white mt-10">
        © {new Date().getFullYear()} JobConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
