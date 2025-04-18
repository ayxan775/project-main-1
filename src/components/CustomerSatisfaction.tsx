import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Leaf, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-react';

export function CustomerSatisfaction() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const priorities = [
    {
      title: "Efficiency",
      description: "Optimizing operations and processes for maximum productivity and resource utilization.",
      icon: <Zap className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Reliability",
      description: "Delivering consistent, dependable solutions that you can count on, every time.",
      icon: <Shield className="w-8 h-8 text-indigo-500" />
    },
    {
      title: "Sustainability",
      description: "Implementing eco-friendly practices and solutions for a better tomorrow.",
      icon: <Leaf className="w-8 h-8 text-green-500" />
    },
    {
      title: "Innovation",
      description: "Embracing cutting-edge technologies and creative solutions to stay ahead.",
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />
    },
    {
      title: "Risk Management",
      description: "Proactive identification and mitigation of potential challenges and risks.",
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />
    },
    {
      title: "Compliance",
      description: "Adhering to industry standards and regulatory requirements with precision.",
      icon: <CheckCircle className="w-8 h-8 text-purple-500" />
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-blue-500/5 to-cyan-500/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-blue-500/5 to-purple-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm uppercase font-bold tracking-wider py-1.5 px-4 rounded-full mb-8 inline-block"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Customer Satisfaction
          </motion.span>
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 dark:text-white">
            Our Priority, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Your Peace of Mind</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're committed to excellence in every aspect of our service delivery, ensuring your success through our comprehensive approach
          </p>
        </motion.div>

        {/* Priorities Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {priorities.map((priority, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 xl:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50 dark:border-gray-700/50 group relative overflow-hidden"
            >
              {/* Content */}
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 w-16 h-16 rounded-xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  {priority.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 dark:text-white">
                  {priority.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {priority.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Pattern */}
        <motion.div 
          className="mt-24 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="flex space-x-3">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i} 
                className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 