/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqs from "../data/faqs.json";

const Faqs = () => {
  return (
    <motion.section
      id="faqs"
      className="w-full py-16 px-4 bg-[#161636]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl text-center text-purple-400 font-semibold tracking-wider mb-2">
          FAQs
        </h2>
        <h3 className="text-3xl sm:text-xl  mb-3 text-center">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">
          Everything you need to know about how JobConnect works for candidates
          and employers.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="max-w-4xl mx-auto divide-y divide-white/10 rounded-xl backdrop-blur-sm"
      >
        {Array.isArray(faqs) &&
          faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <AccordionItem value={`faq-${i}`}>
                <AccordionTrigger className="text-white text-left text-base sm:text-lg font-normal py-4 hover:text-purple-400 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-sm sm:text-base pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
      </Accordion>
    </motion.section>
  );
};

export default Faqs;
