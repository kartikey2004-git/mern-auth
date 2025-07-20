/* eslint-disable no-unused-vars */
import React from "react";
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

import cards from "../data/cards.json";

const UserCard = () => {
  return (
    <section className="mx-auto px-6 py-24 lg:px-20 w-full  text-white flex flex-col items-center justify-center  bg-[#161636] rounded-t-3xl">
      <div className="text-center mb-14">
        <h3 className="text-4xl text-center text-purple-400 font-semibold tracking-wider mb-2">
          Future of Job Hunting
        </h3>
        <h2 className="text-3xl sm:text-base  mb-3">
          Say goodbye to outdated job portals.
        </h2>
        <p className="text-sm sm:text-base text-gray-400 text-center max-w-2xl mx-auto">
          Easily explore curated roles across industries and career levels with
          filters that actually work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card, index) => (
          <motion.article
            key={index}
            className="relative min-h-[150px] flex flex-col justify-between p-6 rounded-2xl border-1 border-purple-400/10 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={index * 0.2}
          >
            <h3 className="text-xl  mb-2">{card.title}</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              {card.content}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default UserCard;
