import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Briefcase, 
  LogOut, 
  ShieldCheck, 
  Building2, 
  ArrowLeft,
  Calendar,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';

const BaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500').trim().replace(/\/+$/, '');

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Candidate applications state
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const fetchApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setAppsLoading(true);
    try {
      const res = await axios.get(`${BaseUrl}/application/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.applications) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to fetch candidate applications:', err);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        setUserData(parsed);
        if (parsed.type !== 'Company') {
          fetchApplications();
        }
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }
    setLoading(false);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selected
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'Applied':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Applied
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in
  if (!userData) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Profile Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            You must be logged in to view your profile and manage your account.
          </p>
          <Link
            to="/auth"
            className="inline-block w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const isCompany = userData.type === 'Company';
  const userInitial = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            Active Session
          </span>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          
          {/* Cover Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Profile Header Content */}
          <div className="px-6 sm:px-8 pb-8 relative pt-0">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
              <div className="flex items-end gap-4">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
                    {userInitial}
                  </div>
                )}

                <div className="mb-1">
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    {userData.name}
                  </h1>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                    {isCompany ? (
                      <span className="flex items-center gap-1 text-indigo-600 font-medium">
                        <Building2 className="w-3.5 h-3.5" /> Hiring Organization
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <User className="w-3.5 h-3.5" /> Job Seeker
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Role Badge */}
              <div className="self-start sm:self-end">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    isCompany
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {userData.type || 'Candidate'}
                </span>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              
              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                <div className="p-2.5 bg-white text-blue-600 rounded-xl shadow-xs border border-slate-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-slate-800 break-all mt-0.5">
                    {userData.email}
                  </p>
                </div>
              </div>

              {/* Account Role Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                <div className="p-2.5 bg-white text-indigo-600 rounded-xl shadow-xs border border-slate-100">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Account Role
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {userData.type === 'Company' ? 'Employer / Company' : 'Individual Candidate'}
                  </p>
                </div>
              </div>

              {/* Account Security Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                <div className="p-2.5 bg-white text-emerald-600 rounded-xl shadow-xs border border-slate-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Account Status
                  </p>
                  <p className="text-sm font-semibold text-emerald-600 mt-0.5">
                    Verified & Active
                  </p>
                </div>
              </div>

              {/* Member Overview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                <div className="p-2.5 bg-white text-amber-600 rounded-xl shadow-xs border border-slate-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Platform Access
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    Full Access
                  </p>
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 text-center sm:text-left">
                Manage your JobNest preferences and session
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-medium text-sm transition active:scale-[0.98] cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

          </div>

        </div>

        {/* CANDIDATE APPLIED JOBS TABLE */}
        {!isCompany && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Applied Jobs</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time status of all your submitted applications and interview results
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
                {applications.length} Applications
              </span>
            </div>

            {appsLoading ? (
              <div className="py-12 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Loading your applications...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No applications yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven't applied to any roles yet. Browse open jobs and submit your profile today.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-xs transition"
                >
                  <span>Explore Open Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Job Title & Company</th>
                      <th className="pb-3 px-4">Location & Mode</th>
                      <th className="pb-3 px-4">Applied Date</th>
                      <th className="pb-3 px-4">Resume</th>
                      <th className="pb-3 pl-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 pr-4">
                          <p className="font-bold text-slate-900 text-sm">
                            {app.jobId?.title || 'Job Position'}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {app.jobId?.company?.name || 'Company'}
                          </p>
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <p className="font-medium text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {app.jobId?.location || 'Remote'}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {app.jobId?.type || 'Full Time'}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                          {formatDate(app.createdAt)}
                        </td>

                        <td className="py-4 px-4 text-xs">
                          {app.resume ? (
                            <a
                              href={app.resume}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="py-4 pl-4 text-right">
                          {renderStatusBadge(app.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
