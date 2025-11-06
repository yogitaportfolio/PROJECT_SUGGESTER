import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { apiFetch } from "../api/apiFetch";

export default function AcademicPerformance({ studentId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const body = {
          academic_session: "2024-2025",
          program_id: "66dca10fc67b8fa0b30548a9",
          enrollment_no: studentId,
        };

        const res = await apiFetch("/students/get_for_student", {
          method: "POST",
          body: JSON.stringify(body),
        });

        const student = res?.data || res;
        const academics = student.academics?.[0];
        const term = academics?.terms?.[0];
        const coursesData = term?.courses || [];

        const formattedCourses = coursesData.map((c) => ({
          subject: c.name || "N/A",
          code: c.code || "—",
          year: term.year || "—",
          marks: c.max_obtained || 0,
          maxMarks: c.max_marks || 100,
          percentage:
            c.max_obtained && c.max_marks
              ? ((c.max_obtained / c.max_marks) * 100).toFixed(1)
              : 0,
        }));

        setCourses(formattedCourses);
      } catch (err) {
        console.error("Error fetching academic performance:", err);
        setError(err.message || "Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) loadData();
  }, [studentId]);

  const getBadgeColor = (percent) => {
    if (percent >= 90) return "bg-green-100 text-green-700";
    if (percent >= 80) return "bg-blue-100 text-blue-700";
    if (percent >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-8 text-gray-600">
        Loading student performance...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center py-8 text-red-500">
        {error}
      </div>
    );

  if (!courses.length)
    return (
      <div className="flex justify-center items-center py-8 text-gray-500">
        No performance records found.
      </div>
    );

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm mt-8 max-w-6xl mx-auto mb-10 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-purple-500" size={22} />
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Academic Performance
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
              <th className="py-3 px-4 font-medium">Subject</th>
              <th className="py-3 px-4 font-medium">Code</th>
              <th className="py-3 px-4 font-medium">Year</th>
              <th className="py-3 px-4 font-medium">Marks</th>
              <th className="py-3 px-4 font-medium">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((subj, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition duration-150"
              >
                <td className="py-3 px-4 text-gray-900 font-medium">
                  {subj.subject}
                </td>
                <td className="py-3 px-4 text-gray-700">{subj.code}</td>
                <td className="py-3 px-4 text-gray-700">{subj.year}</td>
                <td className="py-3 px-4 text-gray-700">
                  {subj.marks}/{subj.maxMarks}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getBadgeColor(
                      subj.percentage
                    )}`}
                  >
                    {subj.percentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
