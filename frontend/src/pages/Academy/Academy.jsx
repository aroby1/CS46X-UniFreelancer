import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AcademyAudienceCards,
  AcademyBenefits,
  AcademyFormatsCarousel,
  AcademyHero,
  AcademyMarquee,
  AcademyPlans,
  AcademySignals,
  AcademyTopPicksCarousel
} from './components';
import './Academy.css';

function Academy() {
  const navigate = useNavigate();
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const handleCreateContent = () => {
    navigate('/academy/create');
  };

  const handleBrowseCourses = () => {
    navigate('/academy/courses');
  };

  const handleViewProgram = (track) => {
    if (track.type === 'course' && track.id) {
      navigate(`/academy/courses/${track.id}`);
      return;
    }

    if (track.type === 'tutorial' && track.id) {
      navigate(`/academy/tutorials/${track.id}`);
      return;
    }

    navigate('/academy/courses');
  };

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const [coursesRes, tutorialsRes] = await Promise.all([
          fetch(`${apiUrl}/api/academy/courses`),
          fetch(`${apiUrl}/api/academy/tutorials`)
        ]);

        const [coursesData, tutorialsData] = await Promise.all([
          coursesRes.ok ? coursesRes.json() : [],
          tutorialsRes.ok ? tutorialsRes.json() : []
        ]);

        const pickArrayFromPayload = (payload) => {
          if (Array.isArray(payload)) {
            return payload;
          }

          if (Array.isArray(payload?.data)) {
            return payload.data;
          }

          if (Array.isArray(payload?.courses)) {
            return payload.courses;
          }

          if (Array.isArray(payload?.tutorials)) {
            return payload.tutorials;
          }

          return [];
        };

        const normalizeTitle = (value) => String(value || '').trim().toLowerCase();

        const courses = pickArrayFromPayload(coursesData);
        const tutorials = pickArrayFromPayload(tutorialsData);

        const targetCourseTitle = 'course to check all parts working';
        const targetTutorialTitle = 'intro to marketing';

        const course =
          courses.find((item) => normalizeTitle(item?.title) === targetCourseTitle) ||
          courses.find((item) => normalizeTitle(item?.title).includes(targetCourseTitle)) ||
          courses[0];

        const tutorial =
          tutorials.find((item) => normalizeTitle(item?.title) === targetTutorialTitle) ||
          tutorials.find((item) => normalizeTitle(item?.title).includes(targetTutorialTitle)) ||
          tutorials[0];

        const picks = [];

        if (course) {
          picks.push({
            id: course._id || course.id,
            type: 'course',
            label: 'Top Pick Course',
            title: course.title,
            level: course.difficulty || course.level || 'All levels',
            metaDetail: `Duration: ${course.duration || 'Self-paced'}`,
            outcome:
              course.description ||
              'A practical course designed to walk through every major workflow end to end.',
            accent: 'Warm',
            image:
              course.thumbnail ||
              course.thumbnailUrl ||
              'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
            imageAlt: `${course.title} course cover`
          });
        }

        if (tutorial) {
          const tutorialFormat = tutorial.videoUrl ? 'Video' : 'Article';

          picks.push({
            id: tutorial._id || tutorial.id,
            type: 'tutorial',
            label: 'Top Pick Tutorial',
            title: tutorial.title,
            level: tutorial.difficulty || 'All levels',
            metaDetail: tutorialFormat,
            outcome:
              tutorial.description ||
              'A focused tutorial to strengthen your fundamentals and apply skills immediately.',
            accent: 'Soft',
            image:
              tutorial.thumbnail ||
              tutorial.thumbnailUrl ||
              'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
            imageAlt: `${tutorial.title} tutorial cover`
          });
        }

        setFeaturedTracks(picks);
      } catch (error) {
        console.error('Error loading top picks:', error);
        setFeaturedTracks([]);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchTopPicks();
  }, []);

  return (
    <div className="academy-page">
      <div className="academy-ambient">
        <span className="ambient-beam beam-one" />
        <span className="ambient-beam beam-two" />
      </div>
      <div className="academy-container">
        <AcademyHero
          onBrowseCourses={handleBrowseCourses}
          onCreateContent={handleCreateContent}
        />
        <AcademySignals />
        <AcademyFormatsCarousel />
        <AcademyMarquee />
        <AcademyAudienceCards
          onBrowseCourses={handleBrowseCourses}
          onCreateContent={handleCreateContent}
        />
        <AcademyTopPicksCarousel
          featuredLoading={featuredLoading}
          featuredTracks={featuredTracks}
          onViewProgram={handleViewProgram}
        />
        <AcademyPlans />
        <AcademyBenefits />
        <p className="academy-image-credit">Photography sourced from Unsplash.</p>
      </div>
    </div>
  );
}

export default Academy;
