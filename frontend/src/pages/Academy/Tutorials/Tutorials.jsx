/* global process */
import React, { useState, useEffect, useCallback } from "react";
import { FiArrowRight } from "react-icons/fi";

function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    topic: [],
    difficulty: [],
    length: [],
  });

  // Fetch tutorials
  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/academy/tutorials`);
      const data = await response.json();
      setTutorials(data);
      setFilteredTutorials(data);
    } catch (error) {
      console.error("Error fetching tutorials:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering Logic
  const filterTutorials = useCallback(() => {
    let filtered = [...tutorials];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Topic filter
    if (filters.topic.length > 0) {
      filtered = filtered.filter((t) => filters.topic.includes(t.topic));
    }

    // Difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter((t) =>
        filters.difficulty.includes(t.difficulty)
      );
    }

    // Length filter
    if (filters.length.length > 0) {
      filtered = filtered.filter((t) =>
        filters.length.includes(t.lengthCategory)
      );
    }

    setFilteredTutorials(filtered);
  }, [tutorials, searchTerm, filters]);

  useEffect(() => {
    filterTutorials();
  }, [filterTutorials]);

  // Toggle handler for filters
  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const updated = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];

      return { ...prev, [category]: updated };
    });
  };

  return (
    <div className="min-h-screen bg-main-bg pb-[60px]">
      <div className="max-w-page mx-auto pt-[100px] px-10 md:max-lg:px-5">

        <h2 className="text-4xl font-bold text-dark mb-2">Tutorials</h2>
        <p className="text-base text-dark-secondary mb-8">
          Quick, focused lessons to help you improve your freelance skills.
        </p>

        {/* Search + Sort */}
        <div className="flex gap-4 mb-8 max-md:flex-col">
          <div className="flex-1 relative flex items-center">
            <span className="absolute left-[15px] text-lg text-muted">🔍</span>
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 pl-[45px] border border-[#ddd] rounded focus:outline-none focus:border-body transition-colors text-md"
            />
          </div>

          <select className="py-3 px-5 border border-[#ddd] rounded bg-white cursor-pointer min-w-[150px] text-md focus:outline-none focus:border-body max-md:w-full">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Trending</option>
          </select>
        </div>

        <div className="flex gap-8 max-lg:flex-col">

          {/* FILTER SIDEBAR */}
          <div className="w-[250px] shrink-0 bg-light-tertiary rounded-[14px] p-5 sticky top-[80px] max-h-[70vh] overflow-y-auto max-lg:w-full">
            <h3 className="text-lg font-bold text-body mb-5">Filter By</h3>

            {/* Topic */}
            <div className="mb-8 pb-5 border-b border-border last:border-b-0">
              <h4 className="text-md font-semibold text-body mb-3">Topic</h4>

              {["Design", "Marketing", "Development", "Business"].map((topic) => (
                <label key={topic} className="flex items-center gap-3 py-2 text-base cursor-pointer text-[#555] hover:[&>span]:text-body">
                  <input
                    type="checkbox"
                    checked={filters.topic.includes(topic)}
                    onChange={() => handleFilterChange("topic", topic)}
                    className="w-[18px] h-[18px]"
                  />
                  <span>{topic}</span>
                </label>
              ))}
            </div>

            {/* Difficulty */}
            <div className="mb-8 pb-5 border-b border-border last:border-b-0">
              <h4 className="text-md font-semibold text-body mb-3">Difficulty</h4>

              {["Beginner", "Intermediate", "Advanced"].map((d) => (
                <label key={d} className="flex items-center gap-3 py-2 text-base cursor-pointer text-[#555] hover:[&>span]:text-body">
                  <input
                    type="checkbox"
                    checked={filters.difficulty.includes(d)}
                    onChange={() => handleFilterChange("difficulty", d)}
                    className="w-[18px] h-[18px]"
                  />
                  <span>{d}</span>
                </label>
              ))}
            </div>

            {/* Length */}
            <div className="mb-8 pb-5 border-b border-border last:border-b-0">
              <h4 className="text-md font-semibold text-body mb-3">Length</h4>

              {["Short", "Medium", "Long"].map((l) => (
                <label key={l} className="flex items-center gap-3 py-2 text-base cursor-pointer text-[#555] hover:[&>span]:text-body">
                  <input
                    type="checkbox"
                    checked={filters.length.includes(l)}
                    onChange={() => handleFilterChange("length", l)}
                    className="w-[18px] h-[18px]"
                  />
                  <span>{l}</span>
                </label>
              ))}
            </div>
          </div>

          {/* TUTORIAL GRID */}
          <div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 max-md:grid-cols-1">
            {loading ? (
              <div className="col-span-full text-center py-[60px] px-5 text-[#666] text-base">Loading tutorials...</div>
            ) : filteredTutorials.length === 0 ? (
              <div className="col-span-full text-center py-[60px] px-5 text-[#666] text-base">
                <p>No tutorials match your search or filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ topic: [], difficulty: [], length: [] });
                  }}
                  className="mt-4 py-3 px-5 bg-body text-white rounded-sm border-none cursor-pointer hover:bg-[#1a252f]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredTutorials.map((tut) => (
                <div className="bg-light-tertiary border border-border rounded-[14px] overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-[5px] hover:shadow-card-hover" key={tut._id}>
                  <div className="w-full h-[180px] bg-[#f5f5f5] overflow-hidden">
                    {tut.thumbnail ? (
                      <img src={tut.thumbnail} alt={tut.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-[55px] text-white">📘</div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-dark mb-[10px]">{tut.title}</h3>

                    <p className="text-base text-dark-secondary leading-[1.4] mb-4">
                      {tut.description.substring(0, 90)}...
                    </p>

                    <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-border-light">
                      <div className="flex items-center gap-2 text-sm text-[#666]">
                        📚 <span>{tut.topic}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#666]">
                        🎯 <span>{tut.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#666]">
                        ⏱️ <span>{tut.lengthCategory}</span>
                      </div>
                    </div>

                    <button className="py-2 px-4 bg-accent text-white rounded-sm border-none cursor-pointer text-base font-medium transition-colors hover:bg-accent-tertiary">
                      View Tutorial <FiArrowRight className="inline ml-1" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Tutorials;
