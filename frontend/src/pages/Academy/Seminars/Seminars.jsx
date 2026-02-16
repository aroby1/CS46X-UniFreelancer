/* global process */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

function Seminars() {
  const navigate = useNavigate();
  const [seminars, setSeminars] = useState([]);
  const [filteredSeminars, setFilteredSeminars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: [],
    duration: [],
    status: []
  });

  // Fetch seminars
  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/academy/seminars`);
      const data = await response.json();
      setSeminars(data);
      setFilteredSeminars(data);
    } catch (error) {
      console.error("Error fetching seminars:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filterSeminars = useCallback(() => {
    let filtered = [...seminars];

    // SEARCH
    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.speaker?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // TYPE FILTER
    if (filters.type.length > 0) {
      filtered = filtered.filter((s) => filters.type.includes(s.type));
    }

    // DURATION FILTER
    if (filters.duration.length > 0) {
      filtered = filtered.filter((s) => {
        const mins = parseInt(s.duration) || 0;

        return filters.duration.some((range) => {
          if (range === "less-60") return mins < 60;
          if (range === "60-90") return mins >= 60 && mins <= 90;
          if (range === "more-90") return mins > 90;
          return false;
        });
      });
    }

    // STATUS FILTER
    if (filters.status.length > 0) {
      filtered = filtered.filter((s) => {
        const watched = s.watched ? "Watched" : "Not Watched";
        return filters.status.includes(watched);
      });
    }

    setFilteredSeminars(filtered);
  }, [seminars, searchTerm, filters]);

  useEffect(() => {
    filterSeminars();
  }, [filterSeminars]);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [category]: updated };
    });
  };

  return (
    <div className="min-h-screen bg-main-bg pb-16">
      <div className="max-w-page mx-auto pt-10 px-10">

        <h2 className="text-4xl font-bold text-dark mb-2">Seminars & Events</h2>
        <p className="text-base text-dark-secondary mb-8">Interactive live sessions and expert workshops</p>

        {/* SEARCH + SORT */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative flex items-center">
            <span className="absolute left-4 text-lg text-muted">🔍</span>
            <input
              type="text"
              placeholder="Search seminars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 pl-11 border border-border rounded focus:outline-none focus:border-accent text-md transition-colors"
            />
          </div>

          <select className="px-4 py-3 rounded border border-border text-md text-dark-secondary bg-white cursor-pointer focus:outline-none focus:border-accent">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Live Sessions</option>
          </select>
        </div>

        <div className="flex gap-8">

          {/* ===== FILTER SIDEBAR ===== */}
          <div className="w-[250px] shrink-0 bg-light-tertiary rounded-[14px] p-5 sticky top-20 max-h-[70vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-5 text-body">Filter By</h3>

            {/* TYPE */}
            <div className="mb-8 pb-5 border-b border-border">
              <h4 className="text-md font-semibold mb-3 text-body">Type</h4>
              {["Live", "Recorded", "Podcast"].map((type) => (
                <label key={type} className="flex items-center gap-3 py-2 cursor-pointer text-base text-dark-tertiary">
                  <input
                    type="checkbox"
                    checked={filters.type.includes(type)}
                    onChange={() => handleFilterChange("type", type)}
                    className="w-[18px] h-[18px]"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            {/* DURATION */}
            <div className="mb-8 pb-5 border-b border-border">
              <h4 className="text-md font-semibold mb-3 text-body">Duration</h4>

              <label className="flex items-center gap-3 py-2 cursor-pointer text-base text-dark-tertiary">
                <input
                  type="checkbox"
                  checked={filters.duration.includes("less-60")}
                  onChange={() => handleFilterChange("duration", "less-60")}
                  className="w-[18px] h-[18px]"
                />
                <span>Less than 60 min</span>
              </label>

              <label className="flex items-center gap-3 py-2 cursor-pointer text-base text-dark-tertiary">
                <input
                  type="checkbox"
                  checked={filters.duration.includes("60-90")}
                  onChange={() => handleFilterChange("duration", "60-90")}
                  className="w-[18px] h-[18px]"
                />
                <span>60–90 min</span>
              </label>

              <label className="flex items-center gap-3 py-2 cursor-pointer text-base text-dark-tertiary">
                <input
                  type="checkbox"
                  checked={filters.duration.includes("more-90")}
                  onChange={() => handleFilterChange("duration", "more-90")}
                  className="w-[18px] h-[18px]"
                />
                <span>More than 90 min</span>
              </label>
            </div>

            {/* STATUS */}
            <div className="mb-8 pb-5 border-b border-border">
              <h4 className="text-md font-semibold mb-3 text-body">Status</h4>
              {["Watched", "Not Watched"].map((status) => (
                <label key={status} className="flex items-center gap-3 py-2 cursor-pointer text-base text-dark-tertiary">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => handleFilterChange("status", status)}
                    className="w-[18px] h-[18px]"
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>

          </div>

          {/* ===== SEMINAR CARDS ===== */}
          <div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
            {loading ? (
              <div className="text-center py-16 text-dark-secondary text-base">Loading seminars...</div>
            ) : filteredSeminars.length === 0 ? (
              <div className="text-center py-16 text-dark-secondary">
                <p>No seminars found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ type: [], duration: [], status: [] });
                  }}
                  className="mt-4 bg-accent text-white font-semibold rounded-md px-6 py-3 hover:bg-accent-secondary transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredSeminars.map((seminar) => (
                <div key={seminar._id} className="bg-white rounded-md shadow-card hover:shadow-card-hover transition-shadow border border-border overflow-hidden">
                  <div className="w-full h-48 bg-gray-100 overflow-hidden">
                    {seminar.thumbnail ? (
                      <img src={seminar.thumbnail} alt={seminar.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-indigo-300 to-purple-400 text-white">🎤</div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-dark">{seminar.title}</h3>

                    <p className="text-base text-dark-secondary mt-2 leading-relaxed">
                      {seminar.description.substring(0, 80)}...
                    </p>

                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex items-center gap-2 text-base text-dark-secondary">
                        <span className="text-base">🗣️</span>
                        <span>{seminar.speaker?.name || "Unknown Speaker"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-base text-dark-secondary">
                        <span className="text-base">📅</span>
                        <span>{seminar.schedule?.date || "TBD"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-base text-dark-secondary">
                        <span className="text-base">🎧</span>
                        <span>{seminar.type}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border">
                      <button className="bg-accent text-white font-semibold rounded-md px-5 py-2.5 hover:bg-accent-secondary transition-colors cursor-pointer text-base" onClick={() => navigate(`/academy/seminars/${seminar._id}`)}>
                        View Details <FiArrowRight className="inline ml-1" />
                      </button>
                    </div>

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

export default Seminars;
