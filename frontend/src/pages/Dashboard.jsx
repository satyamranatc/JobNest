import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Initial mock job postings
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      type: 'Full-Time',
      location: 'Remote',
      salary: '$90,000 - $120,000',
      applicants: 18,
      status: 'Active',
      postedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Node.js Backend Engineer',
      type: 'Full-Time',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      applicants: 12,
      status: 'Active',
      postedDate: '5 days ago',
    },
    {
      id: 3,
      title: 'UI/UX Product Designer',
      type: 'Contract',
      location: 'Remote',
      salary: '$70,000 - $90,000',
      applicants: 8,
      status: 'Active',
      postedDate: '1 week ago',
    },
  ]);

  // Initial mock applicants
  const [applicants] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Senior Frontend Developer',
      appliedAt: '3 hours ago',
      status: 'Under Review',
      score: '94%',
    },
    {
      id: 2,
      name: 'Sophia Patel',
      role: 'Node.js Backend Engineer',
      appliedAt: 'Yesterday',
      status: 'Shortlisted',
      score: '88%',
    },
    {
      id: 3,
      name: 'Liam Miller',
      role: 'UI/UX Product Designer',
      appliedAt: '2 days ago',
      status: 'Interview Scheduled',
      score: '91%',
    },
  ]);

  // Form for posting new job
  const [newJob, setNewJob] = useState({
    title: '',
    location: 'Remote',
    type: 'Full-Time',
    salary: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJob.title) return;

    const job = {
      id: Date.now(),
      title: newJob.title,
      type: newJob.type,
      location: newJob.location || 'Remote',
      salary: newJob.salary || '$80,000 - $110,000',
      applicants: 0,
      status: 'Active',
      postedDate: 'Just now',
    };

    setJobs([job, ...jobs]);
    setNewJob({ title: '', location: 'Remote', type: 'Full-Time', salary: '' });
    setShowPostModal(false);
  };

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const totalApplicants = jobs.reduce((acc, curr) => acc + curr.applicants, 0);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-100 text-purple-700 font-semibold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Company Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {user?.name ? `${user.name} Dashboard` : 'Employer Dashboard'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your job openings, evaluate incoming applicants, and accelerate hiring.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post a New Job</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Jobs</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{jobs.length}</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +2 this month
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applicants</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalApplicants}</h3>
              <p className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
                <Users className="w-3.5 h-3.5" /> Across all listings
              </p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shortlisted</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">12</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High match score
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interviews</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">5</h3>
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5" /> Next 7 days
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Content Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Job Postings (2 cols on large) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-800">Your Posted Positions</h2>
              <span className="text-xs text-slate-500 font-medium">{jobs.length} Active Positions</span>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p>No job postings yet.</p>
                <button
                  onClick={() => setShowPostModal(true)}
                  className="mt-3 text-sm text-blue-600 font-semibold hover:underline"
                >
                  Create your first listing
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-800">{job.title}</h3>
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {job.salary}
                      </span>
                      <span>Posted {job.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">{job.applicants}</span>
                      <p className="text-[11px] text-slate-400">Applicants</p>
                    </div>

                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Candidates column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Recent Applicants</h2>
              <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                View all
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 divide-y divide-slate-100">
              {applicants.map((app) => (
                <div key={app.id} className="py-3.5 first:pt-1 last:pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{app.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{app.role}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {app.score} match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{app.appliedAt}</span>
                    <span className="font-medium text-blue-600">{app.status}</span>
                  </div>
                </div>
              ))}

              <div className="pt-4 text-center">
                <Link
                  to="/jobs"
                  className="text-xs font-medium text-slate-500 hover:text-blue-600 inline-flex items-center gap-1"
                >
                  Explore Candidate Pool <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Post Job Modal */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-100 relative">
              <button
                onClick={() => setShowPostModal(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-900 mb-1">Create Job Opening</h3>
              <p className="text-xs text-slate-500 mb-5">
                Publish a new role on JobNest to start receiving applications.
              </p>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React Frontend Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                      Employment Type
                    </label>
                    <select
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote or San Francisco"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Salary Range (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $90,000 - $120,000 / year"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition cursor-pointer"
                  >
                    Publish Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
