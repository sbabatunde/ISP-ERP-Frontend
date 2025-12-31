import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function ComponentHeader({ header, description }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-3"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        className="flex-1 space-y-3"
      >
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-pink-400 leading-tight"
          >
            {header}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
            className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-primary to-primary/60 rounded-full origin-left"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl font-medium"
        >
          {description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default ComponentHeader;
