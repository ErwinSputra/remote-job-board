"use client";
import { useState } from "react";

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const MoneyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#e68a00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckBadgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#3b82f6"
    stroke="white"
    strokeWidth="2"
  >
    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const RecruitIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function JobDetail() {
  const [bookmarked, setBookmarked] = useState(false);

  const descriptionPoints = [
    "Deliver engaging teaching, coaching, and mentoring sessions on advanced topics in mobile app development.",
    "Guide learners and junior mentors through code reviews, pair programming, and technical discussions while fostering autonomy and critical thinking.",
    "Establish technical standards and serve as a key reference for architecture decisions and engineering best practices.",
    "Co-design and continuously improve curriculum modules by integrating modern mobile engineering practices and emerging technologies.",
    "Plan for long-term technology adoption and migrations (e.g., SwiftUI and new Apple frameworks) to keep the curriculum future-ready.",
    "Model lifelong learning by staying current with platform updates, industry trends, and innovations in education.",
  ];

  const qualifications = [
    "Bachelor's degree or higher in Computer Science, Software Engineering, or a related field.",
    "5+ years of hands-on experience building native iOS applications, with at least 2 years in a senior or lead role involving technical decision-making responsibilities.",
    "Demonstrated experience mentoring developers or leading educational programs, with a strong track record of helping others grow and succeed.",
    "Strong mastery of Swift and deep understanding of UIKit, SwiftUI, and key Apple frameworks.",
    "Proven ability to architect scalable and maintainable mobile applications while anticipating the long-term impact of technical decisions.",
    "Familiarity with CI/CD pipelines, automated testing, and code quality practices.",
    "Excellent communication skills, with the ability to explain complex technical concepts to both technical and non-technical audiences.",
  ];

  const bonusPoints = [
    "Experience with Challenge-Based Learning.",
    "Experience working in Agile environments and applying Scrum or similar methodologies.",
    "Expertise in areas such as Machine Learning, Augmented Reality, Game Development, or DevOps.",
    "Strong English communication skills.",
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <div className="text-white font-bold text-lg">UC</div>
              </div>
              {/* Title */}
              <div>
                <h1 className="text-[17px] font-bold text-gray-900 leading-snug">
                  Senior Software Learning Facilitator Apple Academy
                  <span className="ml-1 text-yellow-400">⚡</span>
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <a
                    href="#"
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Universitas Ciputra
                  </a>
                  <CheckBadgeIcon />
                </div>
              </div>
            </div>
            {/* Recruiter badge */}
            <div className="flex items-center gap-1 text-green-600 text-xs font-medium whitespace-nowrap ml-2">
              <RecruitIcon />
              <span>Rekrutor aktif 3j lalu</span>
            </div>
          </div>

          {/* Meta info */}
          <div className="space-y-1.5 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <UserIcon />
              <span>Penuh waktu</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon />
              <span>On-site • Surabaya</span>
            </div>
            <div className="flex items-center gap-2">
              <BriefcaseIcon />
              <span>Min. 5+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <MoneyIcon />
              <span>Rp10.000.000 – 20.000.000</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button className="bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold px-6 py-2.5 rounded-full text-sm">
              Lamar Cepat
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2.5 rounded-full border transition-colors ${
                bookmarked
                  ? "border-purple-500 text-purple-600 bg-purple-50"
                  : "border-gray-300 text-gray-500 hover:border-gray-400"
              }`}
            >
              <BookmarkIcon />
            </button>
            <button className="p-2.5 rounded-full border border-gray-300 text-gray-500 hover:border-gray-400 transition-colors">
              <ShareIcon />
            </button>
          </div>
          <p className="text-blue-600 text-xs mt-2 hover:underline cursor-pointer">
            Tidak Perlu Sign Up!
          </p>
        </div>

        {/* Job Description Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-[15px] font-bold text-gray-900 mb-3">
            Deskripsi Pekerjaan
          </h2>
          <ul className="space-y-2">
            {descriptionPoints.map((point, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-gray-700 leading-relaxed"
              >
                <span className="mt-1 text-gray-400 flex-shrink-0">*</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-[15px] font-bold text-gray-900 mt-6 mb-3">
            Kualifikasi
          </h2>
          <ul className="space-y-2">
            {qualifications.map((q, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-gray-700 leading-relaxed"
              >
                <span className="mt-1 text-gray-400 shrink-0">*</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-[14px] font-bold text-gray-900 mt-5 mb-2">
            Bonus Points
          </h3>
          <ul className="space-y-2">
            {bonusPoints.map((bp, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-gray-700 leading-relaxed"
              >
                <span className="mt-1 text-gray-400 shrink-0">*</span>
                <span>{bp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* About Company Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-gray-900">
                Tentang Universitas Ciputra
              </h2>
              <CheckBadgeIcon />
            </div>
            <a
              href="#"
              className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              Selengkapnya <span>›</span>
            </a>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Universitas Ciputra memiliki komitmen bahwa disetiap alur
            studi/konsentrasi yang ada memiliki tujuan sama yaitu membekali
            setiap mahasiswa agar mampu menjadi Entrepreneur sesuai keahlian
            masing-masing. Pendidikan dan Praktek Entrepreneurship diberikan
            secara merata disemua alur studi/konsentrasi mulai dari...
          </p>
        </div>
      </div>
    </div>
  );
}
