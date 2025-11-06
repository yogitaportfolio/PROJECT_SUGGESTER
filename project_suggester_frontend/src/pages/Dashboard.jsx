import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";
import { BookOpen, TrendingUp, Target } from "lucide-react";
import AcademicPerformance from "../components/AcademicPerformance";
import ProjectRecommendations from "../components/ProjectRecommendations";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [studentMarks, setStudentMarks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [aiResult, setAiResult] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [error, setError] = useState(null);

  const loadStudent = async () => {
    setLoadingStudent(true);
    try {
      const data = await apiFetch("/students/get_for_student", {
        method: "POST",
        body: JSON.stringify({
          academic_session: "2024-2025",
          program_id: "67062cef94512eb48feb5b02",
        }),
      });
      const studentData = data?.data || data;
      setUser(studentData);
      return studentData;
    } catch (err) {
      setError(err.message || "Unable to load student details.");
      return null;
    } finally {
      setLoadingStudent(false);
    }
  };

  const loadProjects = async () => {
    setProjects([
      { id: 1, title: "Smart Attendance Tracker" },
      { id: 2, title: "Data Visualization Dashboard" },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const student = await loadStudent();
        await loadProjects();
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0063af] to-[#0063af] font-[Poppins] text-gray-800">
      
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-wide">
            University Project Portal
          </h1>
          <p className="text-blue-100 text-sm">
            Final Year Project Recommendation System
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#0056D2] text-white px-5 py-2 rounded-lg hover:bg-[#004bb5] transition-all shadow-md"
        >
          Log Out
        </button>
      </header>

      {/* Main Section */}
      <main className="max-w-6xl mx-auto mt-10 bg-white p-10 rounded-3xl shadow-2xl">
        {loadingStudent ? (
          <p className="text-center text-gray-500">Loading student data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : user ? (
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-6">
              <img
                src={user.photo_url}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-[#004b8d] object-cover shadow-md"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {user.personal_email || "student@email.com"}
                  <br />
                  {user.program_details?.[0]?.program_name ||
                    "B.Tech Computer Science"}{" "}
                  • Year {user.current_year || 1}
                </p>
              </div>
            </div>
            <span className="bg-[#004b8d]/10 text-[#004b8d] px-4 py-2 rounded-full text-sm font-medium border border-[#004b8d]/30">
              🏅 {user.X_class_details?.percentage || "N/A"}% (Xth)
            </span>
          </div>
        ) : (
          <p className="text-center text-gray-500">No student data found.</p>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            icon={<BookOpen />}
            label="Total Projects"
            value={projects.length}
          />
          <SummaryCard
            icon={<TrendingUp />}
            label="AI Suggestions"
            value={aiResult.length > 0 ? "Available" : "Pending"}
          />
          <SummaryCard
            icon={<Target />}
            label="Current Year"
            value={user?.current_year || "1"}
          />
        </div>

        {/* Components */}
        {user?.enrollment_no && (
          <AcademicPerformance studentId={user.enrollment_no} />
        )}

        <ProjectRecommendations user={user} studentMarks={studentMarks} />
      </main>
    </div>
  );
}

/* Summary Card Component */
function SummaryCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-start border border-gray-200 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-bold text-[#004b8d]">{value}</p>
    </div>
  );
}
