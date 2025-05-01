import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Users, Heart, Send, Mail, X } from 'lucide-react';

interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  active: boolean | number;
}

export function Career() {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  
  // Add this for debugging in browsers
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Career page loaded in browser");
      // Expose for browser debugging
      (window as any).__DEBUG_STATE = {
        getJobOpenings: () => jobOpenings,
        refresh: async () => {
          console.log("Manual refresh triggered");
          try {
            const response = await fetch('/api/job-openings?active=true');
            const data = await response.json();
            console.log("Manual fetch result:", data);
            return data;
          } catch (err) {
            console.error("Manual fetch error:", err);
            return null;
          }
        }
      };
    }
  }, [jobOpenings]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const benefits = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Professional Development",
      description: "Continuous learning and growth opportunities"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaborative Environment",
      description: "Work with talented professionals"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Comprehensive Benefits",
      description: "Health insurance and competitive compensation"
    }
  ];

  // Fetch job openings from API
  useEffect(() => {
    const fetchJobOpenings = async () => {
      setLoading(true);
      try {
        console.log('Fetching job openings');
        
        // Add no-cache headers to prevent browser caching issues
        const response = await fetch('/api/job-openings?active=true', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText);
          throw new Error(`Failed to fetch job openings: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched job openings:', data);
        
        if (!Array.isArray(data)) {
          console.error('API did not return an array:', data);
          throw new Error('Invalid data format received from API');
        }
        
        // Convert numeric active field to boolean if needed and filter to ensure only active jobs
        const processedData = data
          .filter((job: any) => job.active === 1 || job.active === true)
          .map((job: any) => ({
            ...job,
            active: true,
            // Ensure all fields exist to prevent UI errors
            department: job.department || 'General',
            location: job.location || 'Remote',
            type: job.type || 'Full-time',
            description: job.description || 'No description provided'
          }));
        
        console.log('Processed job openings:', processedData);
        setJobOpenings(processedData);
      } catch (error) {
        console.error('Error fetching job openings:', error);
        setError(`Failed to load job openings: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobOpenings();
  }, []);

  // Open apply modal with selected job
  const handleApplyNow = (job: JobOpening) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };
  
  // Close apply modal
  const handleCloseModal = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-blue-50 dark:bg-blue-900/20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <svg className="absolute left-0 top-0 h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#2563eb">
            <path d="M0 .5H31.5V32" />
          </svg>
          <div className="absolute inset-0 transform -skew-x-12 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-6 inline-block">
              Join Our Team
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
              Build Your Career With Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Join a dynamic team dedicated to excellence in industrial supply and distribution
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Why Join Us?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We offer more than just a job - we offer a career with growth opportunities
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-blue-600 dark:text-blue-400">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Current Openings</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Explore our current job opportunities and find your perfect role
            </p>
          </div>
          
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading job openings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg shadow mb-4">
                  <p className="font-bold">Error:</p>
                  <p>{error}</p>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
                >
                  Retry
                </button>
              </div>
            ) : jobOpenings.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-4 rounded-lg shadow mb-4">
                  <p className="font-medium">No job openings found.</p>
                  <p className="mt-2">We don't have any active positions at the moment, but please check back later.</p>
                </div>
                <p className="mt-6 text-gray-600 dark:text-gray-300">
                  Want to be notified about future openings? Contact us at <span className="text-blue-600 dark:text-blue-400">careers@company.com</span>
                </p>
              </div>
            ) : (
              jobOpenings.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 dark:text-white">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-full">
                          {job.department}
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-full">
                          {job.location}
                        </span>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm px-3 py-1 rounded-full">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
                    </div>
                    <button 
                      onClick={() => handleApplyNow(job)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
                    >
                      Apply Now <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Apply Now Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseModal}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  onClick={handleCloseModal}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Apply for {selectedJob.title}
                    </h3>
                    <div className="mt-6 space-y-4">
                      <p className="text-gray-600 dark:text-gray-300">
                        Thank you for your interest in joining our team! To apply for this position, 
                        please send your resume and cover letter to:
                      </p>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center">
                        <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                        <a 
                          href="mailto:Sales@azportsupply.com" 
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                          Sales@azportsupply.com
                        </a>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Please include the job title "{selectedJob.title}" in the subject line.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 