import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  ExternalLink,
  FileText,
  Send,
  X,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Award,
  TrendingUp,
  Lightbulb,
  CreditCard
} from 'lucide-react';

const BaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';

export default function Jobs() {
  const navigate = useNavigate();

  // Job data states
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Resume Modal State
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [resumeUrlInput, setResumeUrlInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState('');

  // Application Limit & Dummy Payment State
  const [userApplicationsCount, setUserApplicationsCount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingJobForApply, setPendingJobForApply] = useState(null);
  const [pendingResume, setPendingResume] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');

  // AI Interview State
  const [interviewRunning, setInterviewRunning] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Success Notification
  const [notification, setNotification] = useState(null);

  // Fetch logged in candidate's existing applications
  const fetchUserApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${BaseUrl}/application/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.applications) {
        setUserApplicationsCount(res.data.applications.length);
        const appliedIds = new Set(res.data.applications.map(app => app.jobId?._id || app.jobId));
        setAppliedJobIds(appliedIds);
      }
    } catch (err) {
      console.error('Error fetching candidate applications:', err);
    }
  };

  useEffect(() => {
    fetchUserApplications();
  }, []);

  // Fetch jobs with filters
  const getAllJobs = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.keyword = searchTerm.trim();
      if (selectedType) params.type = selectedType;
      if (selectedWorkMode) params.workMode = selectedWorkMode;
      if (selectedLocation.trim()) params.location = selectedLocation.trim();

      const res = await axios.get(`${BaseUrl}/job`, { params });
      if (res.data && res.data.jobs) {
        setJobs(res.data.jobs);
        setTotalCount(res.data.count ?? res.data.jobs.length);
      } else {
        setJobs([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, [selectedType, selectedWorkMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    getAllJobs();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedWorkMode('');
    setSelectedLocation('');
    setTimeout(() => {
      getAllJobs();
    }, 0);
  };

  // Trigger apply process
  const handleApplyClick = (job) => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      navigate('/auth');
      return;
    }

    let user = null;
    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      user = null;
    }

    if (user?.type === 'Company') {
      alert('Companies cannot apply for jobs. Please log in with a Candidate account.');
      return;
    }

    const candidateResume = user?.resume || '';
    if (!candidateResume) {
      setSelectedJobForApply(job);
      setResumeUrlInput('');
      setApplyError('');
      setShowResumeModal(true);
    } else {
      // Check if user has already applied for 2 or more jobs
      if (userApplicationsCount >= 2) {
        setPendingJobForApply(job);
        setPendingResume(candidateResume);
        setShowPaymentModal(true);
      } else {
        executeApply(job._id, candidateResume);
      }
    }
  };

  const executeApply = async (jobId, resume, hasPaid = false) => {
    setIsApplying(true);
    setApplyError('');
    const token = localStorage.getItem('token');

    try {
      const result = await axios.post(
        `${BaseUrl}/application`,
        {
          jobId,
          resume,
          hasPaid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppliedJobIds((prev) => new Set([...prev, jobId]));
      setUserApplicationsCount((prev) => prev + 1);
      setShowResumeModal(false);
      setShowPaymentModal(false);

      if (result.data?.interviewSet) {
        let interviewPayload = result.data.interviewSet;
        if (typeof interviewPayload === 'string') {
          try {
            interviewPayload = JSON.parse(interviewPayload);
          } catch {
            // Keep as string if parsing fails
          }
        }
        if (result.data?.application?._id) {
          setCurrentApplicationId(result.data.application._id);
        }
        setInterviewData(interviewPayload);
        setInterviewRunning(true);
        setAnswers({});
        setSubmittedAnswers(false);
      } else {
        setNotification('Application submitted successfully!');
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      if (err.response?.status === 402 || err.response?.data?.requiresPayment) {
        const targetJob = selectedJobForApply || jobs.find((j) => j._id === jobId);
        setPendingJobForApply(targetJob);
        setPendingResume(resume);
        setShowPaymentModal(true);
        return;
      }
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setApplyError(msg);
      alert(msg);
    } finally {
      setIsApplying(false);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!resumeUrlInput.trim()) {
      setApplyError('Please enter a valid resume URL or portfolio link.');
      return;
    }
    if (selectedJobForApply) {
      const resume = resumeUrlInput.trim();
      setShowResumeModal(false);
      // Check if user has already applied for 2 or more jobs
      if (userApplicationsCount >= 2) {
        setPendingJobForApply(selectedJobForApply);
        setPendingResume(resume);
        setShowPaymentModal(true);
      } else {
        executeApply(selectedJobForApply._id, resume);
      }
    }
  };

  const handleDummyPayment = () => {
    if (!pendingJobForApply) return;
    setIsProcessingPayment(true);
    // Simulate dummy payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccessMessage('Dummy Payment of ₹1 Verified Successfully!');
      setTimeout(() => {
        setPaymentSuccessMessage('');
        executeApply(pendingJobForApply._id, pendingResume || 'https://default-resume.com', true);
      }, 700);
    }, 800);
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleCompleteInterview = async () => {
    setIsEvaluating(true);
    let token = localStorage.getItem("token");

    try {
      let interViewFeadBack = await axios.post(
        `${BaseUrl}/application/feadback`,
        {
          applicationId: currentApplicationId,
          interviewQuestions: interviewData.questions || interviewData,
          userAnswered: answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fb = interViewFeadBack.data?.feedback || interViewFeadBack.data?.answer || interViewFeadBack.data;
      setFeedbackData(fb);
      setSubmittedAnswers(true);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate interview answers. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const closeInterview = () => {
    setInterviewRunning(false);
    setInterviewData(null);
    setCurrentApplicationId(null);
    setFeedbackData(null);
    setSubmittedAnswers(false);
    setAnswers({});
    setNotification('Interview session completed and saved with your application!');
    setTimeout(() => setNotification(null), 5000);
  };

  // Format Salary nicely
  const formatSalary = (salary) => {
    if (!salary) return 'Competitive';
    if (typeof salary === 'number') {
      return `$${salary.toLocaleString()}/yr`;
    }
    return salary;
  };

  // Format posted date
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Recently';
    const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Global Toast Notification */}
        {notification && (
          <div className="mb-6 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center justify-between transition-all animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 font-medium text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* INTERVIEW MODE SCREEN */}
        {interviewRunning && interviewData ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    AI Pre-Screening Assessment
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {interviewData.greetings || 'AI Candidate Interview'}
                  </h2>
                </div>
              </div>

              <button
                onClick={closeInterview}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Close Assessment"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-8 bg-blue-50/60 border border-blue-100 p-4 rounded-2xl">
              {interviewData.interviewDesc ||
                'Please review and complete the automated technical and behavioral interview questions generated for this role.'}
            </p>

            {submittedAnswers && feedbackData ? (
              <div className="space-y-6 animate-in fade-in">
                {/* Top Summary Banner */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-blue-700 text-xs font-semibold rounded-full shadow-xs border border-blue-100">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>Interview Evaluation</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {feedbackData.greetings || "Candidate Performance Review"}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feedbackData.smallFeedback || "Here is your detailed AI interview evaluation based on your submitted responses."}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-center min-w-[160px]">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Final Score
                    </span>
                    <div className="text-4xl font-extrabold text-blue-600 flex items-baseline justify-center gap-1">
                      <span>{feedbackData.finalScore ?? feedbackData.scores?.finalScore ?? "--"}</span>
                      <span className="text-sm font-semibold text-slate-400">/100</span>
                    </div>
                    {feedbackData.scores?.rightWrongRatio && (
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 mt-2 inline-block">
                        {feedbackData.scores.rightWrongRatio} Accuracy
                      </span>
                    )}
                  </div>
                </div>

                {/* KPIs Section */}
                {Array.isArray(feedbackData.kpis) && feedbackData.kpis.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" /> Key Performance Indicators (KPIs)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {feedbackData.kpis.map((kpi, idx) => (
                        <div key={idx} className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-800">{kpi.name}</span>
                            <span className="text-xs font-extrabold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg">
                              {kpi.score}{kpi.maxScore && kpi.maxScore !== "N/A" ? ` / ${kpi.maxScore}` : ""}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{kpi.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Move Advice */}
                {feedbackData.nextMove && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-2">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600" /> Recommended Next Moves & Study Guide
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                      {feedbackData.nextMove}
                    </p>
                  </div>
                )}

                {/* Question Breakdown & Reviews */}
                {Array.isArray(feedbackData.questionReviews) && feedbackData.questionReviews.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Question Breakdown & Insights
                    </h4>
                    <div className="space-y-3">
                      {feedbackData.questionReviews.map((rev, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs font-bold text-slate-800">{rev.question}</p>
                            {rev.assessment && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                                rev.assessment.toLowerCase().includes("correct") && !rev.assessment.toLowerCase().includes("partially")
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : rev.assessment.toLowerCase().includes("partially")
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}>
                                {rev.assessment}
                              </span>
                            )}
                          </div>
                          {rev.candidateAnswer && (
                            <div className="bg-slate-50 rounded-lg p-2.5 text-xs text-slate-600">
                              <span className="font-semibold text-slate-700">Your Answer: </span>
                              {rev.candidateAnswer}
                            </div>
                          )}
                          {rev.feedback && (
                            <p className="text-xs text-slate-500">
                              <span className="font-semibold text-blue-600">Feedback: </span>
                              {rev.feedback}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Return Button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={closeInterview}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                  >
                    Done & Return to Jobs
                  </button>
                </div>
              </div>
            ) : submittedAnswers ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Answers Successfully Recorded</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Your interview responses have been analyzed and submitted to the hiring team along with your profile.
                </p>
                <button
                  onClick={closeInterview}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  Return to Job Listings
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Array.isArray(interviewData.questions) ? (
                  interviewData.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 transition hover:border-blue-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-slate-800 text-base">
                            {q.title || `Question ${idx + 1}`}
                          </h4>
                        </div>
                        {q.importanceLevel && (
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              q.importanceLevel?.toLowerCase() === 'high' || q.importanceLevel?.toLowerCase() === 'critical'
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-purple-50 text-purple-600 border border-purple-200'
                            }`}
                          >
                            {q.importanceLevel} Priority
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-700 font-medium mb-3 leading-relaxed">
                        {q.question}
                      </p>

                      <textarea
                        rows={4}
                        value={answers[idx] || ''}
                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        placeholder="Type your structured answer here... (Highlight key experience, metrics, and technical approach)"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                      />
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 font-mono whitespace-pre-wrap">
                    {typeof interviewData === 'string' ? interviewData : JSON.stringify(interviewData, null, 2)}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeInterview}
                    className="px-5 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Skip & Return
                  </button>
                  <button
                    type="button"
                    disabled={isEvaluating}
                    onClick={handleCompleteInterview}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-60"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing Answers with AI...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Responses</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD JOBS EXPLORATION VIEW */
          <div>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-700 font-semibold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> Career Opportunities
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Explore Open Roles</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Discover verified opportunities, apply with one click, and take AI-assisted interview evaluations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
                  <span className="text-blue-600 font-bold">{totalCount}</span> Jobs Available
                </span>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-8">
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  
                  {/* Search Keyword */}
                  <div className="relative md:col-span-5">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder-slate-400"
                    />
                  </div>

                  {/* Location Filter */}
                  <div className="relative md:col-span-3">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Location (e.g. Remote, NY)..."
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder-slate-400"
                    />
                  </div>

                  {/* Employment Type */}
                  <div className="md:col-span-2">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-700"
                    >
                      <option value="">All Types</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Work Mode */}
                  <div className="md:col-span-2">
                    <select
                      value={selectedWorkMode}
                      onChange={(e) => setSelectedWorkMode(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-700"
                    >
                      <option value="">All Modes</option>
                      <option value="Work From Home">Work From Home</option>
                      <option value="On Site">On Site</option>
                    </select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {(searchTerm || selectedLocation || selectedType || selectedWorkMode) && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-1 px-2 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Jobs</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Jobs Listings Container */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                        <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                      </div>
                    </div>
                    <div className="h-14 bg-slate-100 rounded-xl" />
                    <div className="h-9 bg-slate-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-lg mx-auto shadow-xs">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No matching jobs found</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Try adjusting your keywords, removing location filters, or resetting filters to see all available roles.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => {
                  const isApplied = appliedJobIds.has(job._id);
                  const companyName = job.company?.name || 'Top Company';
                  const companyAvatar = job.company?.avatar || job.thumbnail;

                  return (
                    <div
                      key={job._id}
                      className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top Company & Badges */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            {companyAvatar ? (
                              <img
                                src={companyAvatar}
                                alt={companyName}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shadow-xs"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                {companyName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                {companyName}
                              </h4>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {formatRelativeTime(job.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Work Mode Badge */}
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                              job.workMode === 'Work From Home'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {job.workMode || 'On Site'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition mb-2 line-clamp-1">
                          {job.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {job.description}
                        </p>

                        {/* Key Tags */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-5">
                          <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1 bg-emerald-50/70 border border-emerald-100/80 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg">
                            <DollarSign className="w-3.5 h-3.5" />
                            {formatSalary(job.salary)}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Interview Ready
                        </span>

                        {isApplied ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApplyClick(job)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs active:scale-[0.98] transition cursor-pointer"
                          >
                            <span>Apply Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* RESUME INPUT MODAL */}
        {showResumeModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 sm:p-8 border border-slate-100 relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowResumeModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                <FileText className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">Provide Your Resume</h3>
              <p className="text-xs text-slate-500 mb-5">
                Applying for <strong className="text-slate-800">{selectedJobForApply?.title}</strong>. Please provide a link to your resume (Google Drive, LinkedIn, or Cloud Storage URL).
              </p>

              {applyError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{applyError}</span>
                </div>
              )}

              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Resume / Portfolio URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://drive.google.com/file/... or link"
                    value={resumeUrlInput}
                    onChange={(e) => setResumeUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Tip: Ensure access permissions are set to anyone with the link can view.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResumeModal(false)}
                    className="px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {isApplying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm & Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================== DUMMY PAYMENT MODAL (>2 Applications) ===================== */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentSuccessMessage('');
                }}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
                <CreditCard className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">Application Limit Reached</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                You have already submitted <strong className="text-slate-800">{userApplicationsCount} applications</strong>.
                Applying for more than 2 jobs requires a small dummy payment.
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Target Role</p>
                  <p className="text-xs text-slate-500 truncate max-w-[200px]">{pendingJobForApply?.title || 'Job Application'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase">Dummy Fee</p>
                  <p className="text-base font-bold text-indigo-600">₹1</p>
                </div>
              </div>

              {paymentSuccessMessage ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{paymentSuccessMessage}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentSuccessMessage('');
                  }}
                  className="px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDummyPayment}
                  disabled={isProcessingPayment || !!paymentSuccessMessage}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : paymentSuccessMessage ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Paid!</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹1 (Dummy)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
