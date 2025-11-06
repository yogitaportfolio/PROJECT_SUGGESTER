import React from "react";
import { ArrowRight, Brain, BarChart3, Users, BookOpen } from "lucide-react";

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0063af] to-[#0063af] text-gray-900 font-[Poppins]">
      
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm text-white">
        <h1 className="text-2xl font-semibold tracking-wide">University Project Portal</h1>
        <nav className="flex items-center gap-6">
          <a href="#" className="hover:text-blue-200 transition">Home</a>
          <a href="#features" className="hover:text-blue-200 transition">Features</a>
          <a href="#about" className="hover:text-blue-200 transition">About</a>
          <a href="#contact" className="hover:text-blue-200 transition">Contact</a>
          <a href="/login">
            <button className="bg-[#0063af] text-white px-5 py-2 rounded-lg hover:bg-[#004bb5] transition shadow-md">
              Get Started
            </button>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-24 text-white bg-[#0063af]">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl leading-tight">
          Empowering Students with <span className="text-[#00aaff]">AI-Driven</span> Project Recommendations
        </h2>
        <p className="text-blue-100 max-w-2xl mb-10">
          Discover your perfect final-year project with AI insights based on your academic performance and interests.
          Join the University Project Portal to explore tailored project ideas and track your growth.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a href="/login">
            <button className="bg-[#0056D2] text-white px-7 py-3 rounded-lg font-semibold hover:bg-[#004bb5] flex items-center gap-2 transition shadow-lg">
              Get Started <ArrowRight size={18} />
            </button>
          </a>
          <a href="#features">
            <button className="border border-white text-white px-7 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#004b8d] transition">
              Learn More
            </button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white rounded-t-3xl shadow-inner" id="features">
        <h3 className="text-3xl font-semibold text-center text-[#003366] mb-14">
          Why Choose Our Platform?
        </h3>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <FeatureCard
            icon={<Brain className="text-[#004b8d]" size={40} />}
            title="AI Recommendations"
            text="Get smart project suggestions tailored to your academic performance."
          />
          <FeatureCard
            icon={<BarChart3 className="text-[#004b8d]" size={40} />}
            title="Performance Analytics"
            text="Visualize your year-wise progress and find areas for improvement."
          />
          <FeatureCard
            icon={<Users className="text-[#004b8d]" size={40} />}
            title="Collaborative Community"
            text="Connect with peers, mentors, and project teams to innovate together."
          />
        </div>
      </section>

      {/* Academic Insights Preview */}
      <section className="py-20 bg-[#f7f9fc]" id="about">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h3 className="text-3xl font-semibold text-[#003366] mb-6">
            Track Your Academic Journey
          </h3>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            View your academic performance over the years and unlock personalized insights that guide your next big project.
          </p>
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-3/4 flex items-center justify-center gap-3">
              <BookOpen className="text-[#004b8d]" size={28} />
              <span className="text-gray-700 font-medium">
                “Your learning data fuels smarter AI recommendations.”
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0063af] py-8 text-center text-blue-100 text-sm tracking-wide">
        © {new Date().getFullYear()} University Project Portal. All rights reserved.
      </footer>
    </div>
  );
};


function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-[] p-8 rounded-2xl text-center hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="text-lg font-semibold text-[#003366] mb-2">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

export default GetStarted;
