/* global process */
import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import AcademySubnav from '../../../components/AcademySubnav';

function Courses() {
  // const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'my-learning' or 'all'

  const [stats, setStats] = useState({
    enrolledCount: 0,
    completedCount: 0,
    learningHours: 0
  });

  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  const [filters, setFilters] = useState({
    level: [],
    language: [],
    duration: [],
    price: []
  });

  // Fetch courses and stats from backend
  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      if (!user._id) return;

      // Fetch user details including enrolled courses
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/academy/courses`);
      if (response.ok) {
        const userData = await response.json();

        // Calculate stats
        const enrolledCount = userData.enrolledCourses ? userData.enrolledCourses.length : 0;
        const completedCount = userData.completedCourses ? userData.completedCourses.length : 0;
        const learningHours = userData.completedCourses
          ? Math.round(userData.completedCourses.reduce((acc, c) => acc + (c.estimatedMinutes || 0), 0) / 60)
          : 0;

        setStats({ enrolledCount, completedCount, learningHours });

        // Set enrolled course IDs for filtering
        const enrolledIds = userData.enrolledCourses ? userData.enrolledCourses.map(c => c._id) : [];
        setEnrolledCourseIds(enrolledIds);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/academy/seminars`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Wrap filterCourses in useCallback
  const filterCourses = useCallback(() => {
    let filtered = [...courses];

    // Filter by Active Tab (My Learning)
    if (activeTab === 'my-learning') {
      filtered = filtered.filter(course => enrolledCourseIds.includes(course._id));
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.level.length > 0) {
      filtered = filtered.filter(course => filters.level.includes(course.difficulty));
    }

    if (filters.duration.length > 0) {
      filtered = filtered.filter(course => {
        const weeks = parseInt(course.duration);
        return filters.duration.some(range => {
          if (range === 'less-4') return weeks < 4;
          if (range === '4-8') return weeks >= 4 && weeks <= 8;
          if (range === '8-12') return weeks > 8 && weeks <= 12;
          if (range === 'more-12') return weeks > 12;
          return false;
        });
      });
    }

    if (filters.price.length > 0) {
      filtered = filtered.filter(course => {
        const price = Number(course.priceAmount ?? 0);
        const isFree =
          course.isFree === true ||
          course.isLiteVersion === true ||
          !price ||
          price === 0;

        return filters.price.some(range => {
          if (range === "free") return isFree;

          if (range === "under-300") {
            // Include free + anything under $300
            return price >= 0 && price < 300;
          }

          if (range === "300-600") return price >= 300 && price <= 600;
          if (range === "over-600") return price > 600;

          return false;
        });
      });
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, filters, activeTab, enrolledCourseIds]);

  // Call filterCourses whenever dependencies change
  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const currentFilters = prev[category];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(v => v !== value)
        : [...currentFilters, value];

      return { ...prev, [category]: newFilters };
    });
  };

  const getCourseDuration = (duration) => {
    if (!duration) return 'Self-paced';
    return duration.includes('week') ? duration : `${duration} weeks`;
  };

  const getCoursePrice = (course) => {
    if (
      course.subscription &&
      (course.subscription.isSubscriptionCourse === true ||
        course.subscription.isSubscriptionCourse === "true")
    ) {
      return "Included in subscription";
    }

    const price = Number(course.priceAmount ?? 0);

    if (price > 0) return `$${price}`;
    if (course.isLiteVersion || course.isFree) return "Free";

    return "Free";
  };

  return (
    <div className="min-h-screen bg-main-bg pb-16">
      <div className="max-w-page mx-auto pt-8 px-10">
        {/* My Learning Section */}
        <AcademySubnav />
        <div className="bg-light-tertiary rounded-md p-10 mb-10 shadow-sm">
          <h2 className="text-4xl font-bold text-dark-primary mb-2">My Learning</h2>
          <p className="text-base text-dark-secondary mb-8">Track your progress and continue your learning journey</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-8">
            <div className="flex items-center gap-4 p-5 bg-light-secondary rounded-[10px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-[32px] w-[50px] h-[50px] flex items-center justify-center bg-light-secondary rounded-[10px]">📖</span>
              <div className="flex-1">
                <div className="text-3xl font-bold text-body leading-none mb-1">{stats.enrolledCount}</div>
                <div className="text-sm text-[#666]">Enrolled Courses</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-light-secondary rounded-[10px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-[32px] w-[50px] h-[50px] flex items-center justify-center bg-light-secondary rounded-[10px]">🎓</span>
              <div className="flex-1">
                <div className="text-3xl font-bold text-body leading-none mb-1">{stats.completedCount}</div>
                <div className="text-sm text-[#666]">Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-light-secondary rounded-[10px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-[32px] w-[50px] h-[50px] flex items-center justify-center bg-light-secondary rounded-[10px]">🕐</span>
              <div className="flex-1">
                <div className="text-3xl font-bold text-body leading-none mb-1">{stats.learningHours}</div>
                <div className="text-sm text-[#666]">Learning Hours</div>
              </div>
            </div>
          </div>

          <div className="flex border-b-2 border-border">
            <button
              className={`py-3 px-6 bg-transparent border-none border-b-[3px] border-b-transparent text-md font-medium cursor-pointer transition-all duration-300 -mb-[2px] hover:text-body ${activeTab === 'my-learning' ? 'text-body font-semibold !border-b-body' : 'text-[#666]'}`}
              onClick={() => setActiveTab('my-learning')}
            >
              My Learning
            </button>
            <button
              className={`py-3 px-6 bg-transparent border-none border-b-[3px] border-b-transparent text-md font-medium cursor-pointer transition-all duration-300 -mb-[2px] hover:text-body ${activeTab === 'all' ? 'text-body font-semibold !border-b-body' : 'text-[#666]'}`}
              onClick={() => setActiveTab('all')}
            >
              All Courses
            </button>
          </div>
        </div>
        {/* Courses Section */}
        <div className="bg-main-bg rounded-md p-10">
          <h2 className="text-4xl font-bold text-dark-primary mb-2">Courses</h2>
          <p className="text-base text-dark-secondary mb-8">Structured learning programs to master freelancing disciplines</p>
          <div className="flex gap-4 mb-8 max-md:flex-col">
            <div className="flex-1 relative flex items-center">
              <span className="absolute left-4 text-lg text-muted">🔍</span>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-4 pl-[45px] border border-[#ddd] rounded font-sans text-md transition-colors duration-300 focus:outline-none focus:border-body"
              />
            </div>
            <select className="py-3 px-5 border border-[#ddd] rounded font-sans text-md bg-white cursor-pointer min-w-[150px] focus:outline-none focus:border-body max-md:w-full">
              <option>All Courses</option>
              <option>Most Popular</option>
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="flex gap-8 max-lg:flex-col">
            <div className="w-[250px] shrink-0 bg-light-tertiary rounded-[14px] px-5 py-4 sticky top-20 h-fit max-lg:w-full">
              <h3 className="text-lg font-bold text-body mb-5">Filter By</h3>

              {/* Level Filter */}
              <div className="mb-8 pb-5 border-b border-border">
                <h4 className="text-md font-semibold text-body mb-3">Level</h4>
                {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <label key={level} className="flex items-center gap-3 py-2 cursor-pointer text-base text-[#555] hover:text-body">
                    <input
                      type="checkbox"
                      checked={filters.level.includes(level)}
                      onChange={() => handleFilterChange('level', level)}
                      className="w-[18px] h-[18px] cursor-pointer"
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>

              {/* Duration Filter */}
              <div className="mb-8 pb-5 border-b border-border">
                <h4 className="text-md font-semibold text-body mb-3">Duration</h4>
                {['less-4', '4-8', '8-12', 'more-12'].map(range => (
                  <label key={range} className="flex items-center gap-3 py-2 cursor-pointer text-base text-[#555] hover:text-body">
                    <input
                      type="checkbox"
                      checked={filters.duration.includes(range)}
                      onChange={() => handleFilterChange('duration', range)}
                      className="w-[18px] h-[18px] cursor-pointer"
                    />
                    <span>
                      {range === 'less-4' ? 'Less than 4 weeks' :
                        range === '4-8' ? '4-8 weeks' :
                          range === '8-12' ? '8-12 weeks' :
                            'More than 12 weeks'}
                    </span>
                  </label>
                ))}
              </div>

              {/* Price Filter */}
              <div className="mb-8 pb-5 last:border-b-0">
                <h4 className="text-md font-semibold text-body mb-3">Price</h4>
                {['free', 'under-300', '300-600', 'over-600'].map(range => (
                  <label key={range} className="flex items-center gap-3 py-2 cursor-pointer text-base text-[#555] hover:text-body">
                    <input
                      type="checkbox"
                      checked={filters.price.includes(range)}
                      onChange={() => handleFilterChange('price', range)}
                      className="w-[18px] h-[18px] cursor-pointer"
                    />
                    <span>
                      {range === 'free' ? 'Free' :
                        range === 'under-300' ? 'Under $300' :
                          range === '300-600' ? '$300 - $600' :
                            'Over $600'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="flex-1 grid grid-cols-3 auto-rows-[1fr] gap-6 max-md:grid-cols-1">
              {loading ? (
                <div className="col-span-full text-center py-16 px-5 text-[#666] text-base">Loading courses...</div>
              ) : filteredCourses.length === 0 ? (
                <div className="col-span-full text-center py-16 px-5 text-[#666] text-base">
                  <p className="mb-5">No courses found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ level: [], language: [], duration: [], price: [] });
                    }}
                    className="py-3 px-5 bg-body text-white border-none rounded-sm text-base cursor-pointer hover:bg-[#1a252f]"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredCourses.map(course => (
                  <div key={course.id} className="bg-light-tertiary border border-border rounded-[14px] overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover flex flex-col">
                    <div className="w-full h-[180px] overflow-hidden bg-[#f5f5f5] rounded-t-lg">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[60px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">📚</div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-dark-primary flex-1">{course.title}</h3>
                        {course.isLiteVersion && <span className="py-1 px-3 bg-[#e8e8e8] text-[#666] text-xs font-medium rounded-md">Lite</span>}
                      </div>
                      <p className="text-base text-dark-secondary leading-relaxed mb-4">{course.description?.substring(0, 80)}...</p>
                      <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-border-light mt-auto">
                        <div className="flex items-center gap-2 text-sm text-[#666]"><span className="text-base">🕐</span><span>{getCourseDuration(course.duration)}</span></div>
                        <div className="flex items-center gap-2 text-sm text-[#666]"><span className="text-base">🏷️</span><span>{course.category || 'General'}</span></div>
                        <div className="flex items-center gap-2 text-sm text-[#666]"><span className="text-base">📊</span><span>{course.difficulty}</span></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-body">{getCoursePrice(course)}</div>
                        <button className="py-2 px-4 bg-accent text-white border-none rounded-sm text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-accent-tertiary">View Details <FiArrowRight className="inline ml-1" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
