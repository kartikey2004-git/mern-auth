/* eslint-disable no-unused-vars */
import React from "react";
import features from "../data/features.json";
import { motion } from "framer-motion";

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

const FeaturesCard = () => {
  return (
    <>
      {/* Features Section */}
      <section className="mx-auto px-6 py-24 lg:px-20 bg-[#161636]  w-full">
        <div className="text-center mb-14">
          <h3 className="text-3xl text-center text-purple-400 font-semibold tracking-wider mb-2">
            Who is JobConnect For?
          </h3>

          <h2 className="text-3xl sm:text-xl font-semibold mb-3 text-center">
            Built for Candidates, Professionals, and Recruiters
          </h2>

          <p className="text-sm sm:text-base text-gray-400 text-center max-w-2xl mx-auto">
            JobConnect helps job seekers find the right roles and teams hire
            faster — whether you're starting out, growing your career, or
            building one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((card, i) => (
            <motion.article
              key={i}
              className="relative min-h-[150px] flex flex-col justify-between p-6 rounded-2xl border-1 border-purple-400/10 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.2}
            >
              <h3 className="text-xl  mb-2">{card.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {card.content}
              </p>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
};

export default FeaturesCard;
