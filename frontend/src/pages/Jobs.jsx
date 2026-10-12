import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Bookmark, 
  BookmarkCheck,
  Building,
  Sparkles,
  Filter
} from 'lucide-react';

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // Mock Job Listings for Candidate exploration
  const initialJobs = [
    {
      id: 1,
      title: 'Full Stack React & Node Developer',
      company: 'TechNest Solutions',
      location: 'Remote',
      type: 'Full-Time',
      salary: '$95,000 - $125,000',
      posted: '1 day ago',
      category: 'Tech',
      tags: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      description: 'Looking for a full stack developer to help build scalable web apps and interview platforms.',
    },
    {
      id: 2,
      title: 'Senior Frontend Engineer',
      company: 'Apex Cloud Systems',
      location: 'San Francisco, CA',
      type: 'Full-Time',
      salary: '$120,000 - $150,000',
      posted: '2 days ago',
      category: 'Tech',
      tags: ['TypeScript', 'Next.js', 'Vite', 'GraphQL'],
      description: 'Design and implement ultra-responsive user interfaces with modern React ecosystem tools.',
    },
    {
      id: 3,
      title: 'Product UI/UX Designer',
      company: 'PixelCraft Digital',
      location: 'Remote',
      type: 'Contract',
      salary: '$75,000 - $95,000',
      posted: '3 days ago',
      category: 'Design',
      tags: ['Figma', 'Prototyping', 'Design Systems', 'UX Research'],
      description: 'Craft intuitive customer journeys and premium interfaces for our SaaS products.',
    },
    {
      id: 4,
      title: 'Backend API Developer',
      company: 'DataStream Corp',
      location: 'Austin, TX (Hybrid)',
      type: 'Full-Time',
      salary: '$105,000 - $135,000',
      posted: '4 days ago',
      category: 'Tech',
      tags: ['Express.js', 'REST APIs', 'PostgreSQL', 'Docker'],
      description: 'Develop high-throughput REST APIs and microservices for data processing pipelines.',
    },
    {
      id: 5,
      title: 'Junior Web Developer',
      company: 'Elevate Media',
      location: 'Remote',
      type: 'Internship',
      salary: '$45,000 - $60,000',
      posted: 'Just now',
      category: 'Tech',
      tags: ['JavaScript', 'HTML/CSS', 'Git', 'React'],
      description: 'Exciting opportunity for entry-level developers eager to learn and grow in a fast-paced team.',
    },
  ];

  const filterOptions = ['All', 'Remote', 'Full-Time', 'Tech', 'Design'];

  // Filter jobs based on search term & tag
  const filteredJobs = initialJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Remote') return job.location.toLowerCase().includes('remote');
    if (selectedFilter === 'Full-Time') return job.type === 'Full-Time';
    if (selectedFilter === 'Tech') return job.category === 'Tech';
    if (selectedFilter === 'Design') return job.category === 'Design';

    return true;
  });

  const handleApply = (id) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
    }
  };

  const toggleSave = (id) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter((jobId) => jobId !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Explore Open Roles
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Discover opportunities from top companies hiring now on JobNest.
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative flex items-center shadow-md rounded-2xl overflow-hidden bg-white border border-slate-200">
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <input
              type="text"
              placeholder="Search by job title, skill, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">
            Showing <span className="text-blue-600">{filteredJobs.length}</span> positions
          </p>
          {appliedJobs.length > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2.5 py-1 rounded-lg">
              {appliedJobs.length} Application(s) Submitted
            </span>
          )}
        </div>

        {/* Job Cards Grid */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">No matching jobs found</h3>
              <p className="text-sm text-slate-500">
                Try searching with different keywords or resetting filters.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isApplied = appliedJobs.includes(job.id);
              const isSaved = savedJobs.includes(job.id);

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                        {job.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span>{job.company}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {job.posted}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSave(job.id)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer"
                      title={isSaved ? 'Saved' : 'Save Job'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-5 h-5 text-blue-600 fill-blue-50" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApply(job.id)}
                      disabled={isApplied}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-1.5 cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.98]'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Applied
                        </>
                      ) : (
                        'Easy Apply'
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
