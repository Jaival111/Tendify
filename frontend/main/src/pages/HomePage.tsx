import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';
import "tailwindcss";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">LearningHub</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Learn without limits
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
              Start, switch, or advance your career with thousands of courses, certifications, and degree programs.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                >
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Why choose LearningHub?
            </h2>
            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Flexible Learning</h3>
                <p className="mt-2 text-base text-gray-600">
                  Learn at your own pace with on-demand video lectures, interactive exercises, and projects.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Expert Instructors</h3>
                <p className="mt-2 text-base text-gray-600">
                  Learn from industry professionals and academic experts from top institutions worldwide.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Verified Certificates</h3>
                <p className="mt-2 text-base text-gray-600">
                  Earn industry-recognized credentials to showcase your skills and knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;