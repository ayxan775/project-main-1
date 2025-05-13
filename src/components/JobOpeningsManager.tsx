import React, { useState, useEffect } from 'react';
import { Briefcase, Edit, Trash2, Plus, X, Save, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router'; // Import useRouter

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

interface JobOpening {
  id?: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  active: boolean;
}

interface JobOpeningsManagerProps {
  token: string;
}

export function JobOpeningsManager({ token }: JobOpeningsManagerProps) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'az' ? az.jobOpeningsManager : locale === 'ru' ? ru.jobOpeningsManager : en.jobOpeningsManager; // Select translations

  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<JobOpening>({
    title: '',
    department: '',
    location: '',
    type: '',
    description: '',
    active: true
  });
  const [isEditing, setIsEditing] = useState(false);

  // Use translations for department names
  const departments = [
    { id: 'all', name: t.deptAll },
    { id: 'engineering', name: t.deptEngineering },
    { id: 'sales', name: t.deptSales },
    { id: 'operations', name: t.deptOperations },
    { id: 'logistics', name: t.deptLogistics }
    // Note: 'general' is used as a fallback, ensure t.deptGeneral exists if it needs to be selectable
  ];

  // Use translations for job types
  const jobTypes = [t.typeFullTime, t.typePartTime, t.typeContract, t.typeInternship];

  // Fetch all job openings
  const fetchJobOpenings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/job-openings');

      if (!response.ok) {
        throw new Error(t.errorFetch); // Use translation
      }

      const data = await response.json();
      setJobOpenings(data);
    } catch (error) {
      setError(t.errorLoad); // Use translation
      console.error('Error fetching job openings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load job openings on component mount
  useEffect(() => {
    fetchJobOpenings();
  }, []);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: '',
      description: '',
      active: true
    });
    setIsEditing(false);
  };
  
  // Open modal to add new job opening
  const handleAddJobOpening = () => {
    resetForm();
    setShowModal(true);
  };
  
  // Open modal to edit job opening
  const handleEditJobOpening = (job: JobOpening) => {
    setFormData({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      active: job.active !== undefined ? job.active : true
    });
    setIsEditing(true);
    setShowModal(true);
  };
  
  // Save job opening (create or update)
  const handleSaveJobOpening = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.title || !formData.location || !formData.type || !formData.description) {
      setError(t.errorAllFieldsRequired); // Use translation
      return;
    }
    
    try {
      const url = '/api/job-openings';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Set a default department if not provided
      const dataToSend = {
        ...formData,
        department: formData.department || 'general' // Consider translating 'general' if it's user-facing
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorKey = isEditing ? t.errorUpdate : t.errorCreate;
        throw new Error(errorKey); // Use translation
      }

      // Refresh job openings list
      await fetchJobOpenings();

      // Close modal and reset form
      setShowModal(false);
      resetForm();
    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : t.errorUnknown}`); // Use translation
      console.error('Error saving job opening:', error);
    }
  };
  
  // Delete job opening
  const handleDeleteJobOpening = async (id: number) => {
    if (!window.confirm(t.confirmDelete)) { // Use translation
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch(`/api/job-openings?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.errorDelete); // Use translation
      }

      // Remove the deleted job from the state
      setJobOpenings(prev => prev.filter(job => job.id !== id));

      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error deleting job opening:', error);
      setError(error instanceof Error ? error.message : t.errorDelete); // Use translation
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2> {/* Use translation */}
        <button
          onClick={handleAddJobOpening}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{t.buttonAddNew}</span> {/* Use translation */}
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">{t.statusLoading}</div> // Use translation
      ) : jobOpenings.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          {t.statusNoJobs} {/* Use translation */}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.headerJobTitle} {/* Use translation */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.headerDepartment} {/* Use translation */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.headerLocation} {/* Use translation */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.headerType} {/* Use translation */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.headerStatus} {/* Use translation */}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.headerActions} {/* Use translation */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {jobOpenings.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {job.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {job.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {job.active ? t.statusActive : t.statusInactive} {/* Use translation */}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditJobOpening(job)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="w-5 h-5" />
                        <span className="sr-only">{t.srEdit}</span> {/* Use translation */}
                      </button>
                      <button
                        onClick={() => job.id && handleDeleteJobOpening(job.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="sr-only">{t.srDelete}</span> {/* Use translation */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal for adding/editing job openings */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {isEditing ? t.modalTitleEdit : t.modalTitleAdd} {/* Use translation */}
                    </h3>

                    <div className="mt-4">
                      <form onSubmit={handleSaveJobOpening} className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t.labelJobTitle} {/* Use translation */}
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t.labelLocation} {/* Use translation */}
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t.labelJobType} {/* Use translation */}
                          </label>
                          <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          >
                            <option value="">{t.selectJobTypePlaceholder}</option> {/* Use translation */}
                            {jobTypes.map((type) => ( // jobTypes array is already translated
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t.labelDescription} {/* Use translation */}
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          ></textarea>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            {t.labelActive} {/* Use translation */}
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveJobOpening}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t.buttonSave} {/* Use translation */}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {t.buttonCancel} {/* Use translation */}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 