import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        setUserData(JSON.parse(rawUser));
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }
    setLoading(false);
  }, []);

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
      <div className="max-w-2xl mx-auto">
        
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
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
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

      </div>
    </div>
  );
}
