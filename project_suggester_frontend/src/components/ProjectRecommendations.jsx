import React, { useState } from "react";
import { Brain, RefreshCw, X, Clock, User, Star } from "lucide-react";

export default function ProjectRecommendations({ user, studentMarks }) {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tabCount, setTabCount] = useState(0); // 
  
  const getMatchColor = (percentage) => {
    const num = parseInt(percentage);
    if (isNaN(num)) return "text-gray-600";
    if (num >= 85) return "text-green-600";
    if (num >= 70) return "text-orange-500";
    return "text-red-500";
  };

 
  const handleGenerateAI = async () => {
    if (!user) return alert("Student data not loaded yet!");
    if (tabs.length >= 5) return;
    setIsGenerating(true);

    try {
      let performanceText = "";
      if (studentMarks?.length > 0) {
        performanceText = studentMarks
          .map(
            (m, i) =>
              `${i + 1}. ${m.course_name || m.subject || "Subject"} — ${
                m.percentage || m.grade || "N/A"
              }`
          )
          .join("\n");
      } else {
        performanceText = `
1. Programming Fundamentals — 85%
2. Data Structures — 78%
3. Database Systems — 92%
4. Software Engineering — 88%
5. Machine Learning — 76%
`;
      }

      const prompt = `
You are an academic project advisor.

Student Details:
- Name: ${user.name}
- Enrollment No: ${user.enrollment_no}
- Program: ${user.program_details?.[0]?.program_name || "B.Tech CSE"}
- Current Year: ${user.current_year || "N/A"}
- 10th %: ${user.X_class_details?.percentage || "N/A"}

Academic Performance:
${performanceText}

Generate exactly 3 detailed project recommendations in JSON format:
[
  {
    "title": "Project Title",
    "description": "Brief project overview.",
    "strengths": "Student's key strengths relevant to this project.",
    "improvement": "Suggested improvement areas.",
    "skills": ["Skill 1", "Skill 2", "Skill 3"],
    "duration": "3-4 months",
    "match_percentage": "90%",
    "mentor": "Dr. Emily Rodriguez",
    "level": "Intermediate",
    "ai_analysis": "Explain how and why this project suits the student’s academic profile."
  }
]
`;

      const response = await fetch("http://localhost:4000/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();
      let aiResults = [];

      if (Array.isArray(result.result)) {
        aiResults = result.result;
      } else if (typeof result.result === "string") {
        try {
          aiResults = JSON.parse(result.result);
        } catch {
          aiResults = [{ title: "AI Output", description: result.result }];
        }
      }

      const newTabNumber = tabCount + 1;
      const newTab = {
        id: Date.now(),
        title: `Tab${newTabNumber}`,
        ideas: aiResults,
      };

      const updatedTabs = [...tabs, newTab];
      setTabs(updatedTabs);
      setActiveTab(newTab.id);
      setTabCount(newTabNumber); // update numbering
    } catch (err) {
      console.error("Error generating AI recommendations:", err);
      alert("Error generating AI recommendations.");
    } finally {
      setIsGenerating(false);
    }
  };

 
  const handleCloseTab = (tabId) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(updatedTabs);
    if (activeTab === tabId) {
      setActiveTab(updatedTabs.length ? updatedTabs[updatedTabs.length - 1].id : null);
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm mt-8 max-w-6xl mx-auto mb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain className="text-purple-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900">
            AI-Powered Project Recommendations
          </h2>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateAI}
          disabled={isGenerating || tabs.length >= 5}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg transition ${
            tabs.length >= 5
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#0063af] hover:bg-blue-600 text-white"
          }`}
        >
          <RefreshCw size={18} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating
            ? "Generating..."
            : tabs.length >= 5
            ? "Limit Reached (5)"
            : "Generate customize Ideas"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
              activeTab === tab.id
                ? "bg-[#0063af] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <button onClick={() => setActiveTab(tab.id)}>{tab.title}</button>
            <button
              onClick={() => handleCloseTab(tab.id)}
              className="ml-2 hover:text-red-400"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* AI Output */}
      <div className="bg-gray-50 border rounded-xl p-5 shadow-sm min-h-[120px]">
        {activeTab ? (
          tabs
            .find((t) => t.id === activeTab)
            ?.ideas.map((idea, i) => (
              <div
                key={i}
                className="mb-6 p-6 bg-green-50 border border-green-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {idea.title}
                  </h3>
                  <div
                    className={`flex items-center gap-1 font-medium ${getMatchColor(
                      idea.match_percentage
                    )}`}
                  >
                    <Star
                      size={18}
                      className={`${getMatchColor(
                        idea.match_percentage
                      )} fill-current`}
                    />
                    {idea.match_percentage || "90% Match"}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{idea.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="text-green-700 font-semibold mb-1">
                      Your Strengths
                    </h4>
                    <p className="text-gray-800 text-sm">{idea.strengths}</p>
                  </div>
                  <div>
                    <h4 className="text-red-600 font-semibold mb-1">
                      Areas to Improve
                    </h4>
                    <p className="text-gray-800 text-sm">{idea.improvement}</p>
                  </div>
                </div>

                 <div>
                    <h4 className="text-black-600 font-semibold mb-1">
                     Skills
                    </h4>
                   
                  </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.skills?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {idea.duration || "3–4 months"}
                  </div>
                 
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    {idea.level || "Intermediate"}
                  </span>
                </div>

                <div className="bg-white mt-5 p-4 border rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-1">AI Analysis</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {idea.ai_analysis}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <div className="flex justify-center items-center text-gray-500 py-8">
            <Brain className="text-purple-400 mr-2" /> AI results will appear here.
          </div>
        )}
      </div>
    </section>
  );
}









// import React, { useState } from "react";
// import { Brain, RefreshCw, X, Clock, User, Star } from "lucide-react";

// export default function ProjectRecommendations({ user, studentMarks }) {
//   const [tabs, setTabs] = useState([]);
//   const [activeTab, setActiveTab] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);

 
//   const getMatchColor = (percentage) => {
//     const num = parseInt(percentage);
//     if (isNaN(num)) return "text-gray-600";
//     if (num >= 85) return "text-green-600";
//     if (num >= 70) return "text-orange-500";
//     return "text-red-500";
//   };

  
//   const handleGenerateAI = async () => {
//     if (!user) return alert("Student data not loaded yet!");
//     if (tabs.length >= 5) return;
//     setIsGenerating(true);

//     try {
//       let performanceText = "";
//       if (studentMarks?.length > 0) {
//         performanceText = studentMarks
//           .map(
//             (m, i) =>
//               `${i + 1}. ${m.course_name || m.subject || "Subject"} — ${
//                 m.percentage || m.grade || "N/A"
//               }`
//           )
//           .join("\n");
//       } else {
//         performanceText = `
// 1. Programming Fundamentals — 85%
// 2. Data Structures — 78%
// 3. Database Systems — 92%
// 4. Software Engineering — 88%
// 5. Machine Learning — 76%
// `;
//       }

//       const prompt = `
// You are an academic project advisor.

// Student Details:
// - Name: ${user.name}
// - Enrollment No: ${user.enrollment_no}
// - Program: ${user.program_details?.[0]?.program_name || "B.Tech CSE"}
// - Current Year: ${user.current_year || "N/A"}
// - 10th %: ${user.X_class_details?.percentage || "N/A"}

// Academic Performance:
// ${performanceText}

// Generate 3 detailed project recommendations with this structure:
// [
//   {
//     "title": "Project Title",
//     "description": "Brief project overview.",
//     "strengths": "Key strengths of the student relevant to this project.",
//     "improvement": "Suggested improvement areas.",
//     "skills": ["Skill 1", "Skill 2", "Skill 3"],
//     "duration": "3-4 months",
//     "match_percentage": "90%",
//     "mentor": "Dr. Emily Rodriguez",
//     "level": "Intermediate",
//     "ai_analysis": "Explain how and why this project suits the student’s academic profile."
//   }
// ]
// `;

//       const response = await fetch("http://localhost:4000/api/ai/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });

//       const result = await response.json();
//       let aiResults = [];

//       if (Array.isArray(result.result)) {
//         aiResults = result.result;
//       } else if (typeof result.result === "string") {
//         try {
//           aiResults = JSON.parse(result.result);
//         } catch {
//           aiResults = [{ title: "AI Output", description: result.result }];
//         }
//       }

//       const newTab = {
//         id: Date.now(),
//         title: `Tab ${tabs.length + 1}`,
//         ideas: aiResults,
//       };

//       const updatedTabs = [...tabs, newTab];
//       setTabs(updatedTabs);
//       setActiveTab(newTab.id);
//     } catch (err) {
//       console.error("Error generating AI recommendations:", err);
//       alert("Error generating AI recommendations.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };


//   const handleCloseTab = (tabId) => {
//     const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
//     setTabs(updatedTabs);

//     if (activeTab === tabId) {
//       setActiveTab(updatedTabs.length ? updatedTabs[updatedTabs.length - 1].id : null);
//     }
//   };

//   return (
//     <section className="bg-white p-6 rounded-2xl shadow-sm mt-8 max-w-6xl mx-auto mb-10">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-2">
//           <Brain className="text-purple-500" size={24} />
//           <h2 className="text-lg font-semibold text-gray-900">
//             AI-Powered Project Recommendations
//           </h2>
//         </div>

//         {/* Generate Button */}
//         <button
//           onClick={handleGenerateAI}
//           disabled={isGenerating || tabs.length >= 5}
//           className={`flex items-center gap-2 px-5 py-2 rounded-lg transition ${
//             tabs.length >= 5
//               ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//               : "bg-purple-500 hover:bg-purple-600 text-white"
//           }`}
//         >
//           <RefreshCw size={18} className={isGenerating ? "animate-spin" : ""} />
//           {isGenerating
//             ? "Generating..."
//             : tabs.length >= 5
//             ? "Limit Reached (5)"
//             : "Generate customized Ideas"}
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {tabs.map((tab) => (
//           <div
//             key={tab.id}
//             className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
//               activeTab === tab.id
//                 ? "bg-purple-500 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             <button onClick={() => setActiveTab(tab.id)}>{tab.title}</button>
//             <button
//               onClick={() => handleCloseTab(tab.id)}
//               className="ml-2 hover:text-red-400"
//             >
//               <X size={14} />
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* AI Cards */}
//       <div className="bg-gray-50 border rounded-xl p-5 shadow-sm min-h-[120px]">
//         {activeTab ? (
//           tabs
//             .find((t) => t.id === activeTab)
//             ?.ideas.map((idea, i) => (
//               <div
//                 key={i}
//                 className="mb-6 p-6 bg-green-50 border border-green-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
//               >
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     {idea.title}
//                   </h3>
//                   <div
//                     className={`flex items-center gap-1 font-medium ${getMatchColor(
//                       idea.match_percentage
//                     )}`}
//                   >
//                     <Star
//                       size={18}
//                       className={`${getMatchColor(
//                         idea.match_percentage
//                       )} fill-current`}
//                     />
//                     {idea.match_percentage || "90% Match"}
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <p className="text-gray-700 mb-4">{idea.description}</p>

//                 {/* Strengths / Improvements */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//                   <div>
//                     <h4 className="text-green-700 font-semibold mb-1">
//                       Your Strengths
//                     </h4>
//                     <p className="text-gray-800 text-sm">{idea.strengths}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-red-600 font-semibold mb-1">
//                       Areas to Improve
//                     </h4>
//                     <p className="text-gray-800 text-sm">{idea.improvement}</p>
//                   </div>
//                 </div>

//                 {/* Skills */}
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {idea.skills?.map((tag, index) => (
//                     <span
//                       key={index}
//                       className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Duration / Mentor / Level */}
//                 <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 border-t pt-4">
//                   <div className="flex items-center gap-2">
//                     <Clock size={16} />
//                     {idea.duration || "3–4 months"}
//                   </div>
                 
//                   <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
//                     {idea.level || "Intermediate"}
//                   </span>
//                 </div>

//                 {/* AI Analysis */}
                
//                 <div className="bg-white mt-5 p-4 border rounded-lg shadow-sm">
                  
//                   <span className="font-semibold mb-1">Analysis </span>
//                   <p className="text-gray-700 text-sm leading-relaxed">
//                   {/* <RefreshCw size={18} className={isGenerating ? "animate-spin" : ""} /> */}
//                     {idea.ai_analysis}
//                   </p>
//                 </div>
//               </div>
//             ))
//         ) : (
//           <div className="flex justify-center items-center text-gray-500 py-8">
//             <Brain className="text-purple-400 mr-2" /> AI results will appear here.
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
