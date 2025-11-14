import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', delay: custom }
  })
};

export default function Section({ children, delay = 0, className = '', as: As = 'section' }) {
  return (
    <As className={className}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={delay}
        variants={variants}
      >
        {children}
      </motion.div>
    </As>
  );
}

