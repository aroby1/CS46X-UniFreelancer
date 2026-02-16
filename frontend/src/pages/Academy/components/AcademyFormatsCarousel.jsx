import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiCalendar, FiMic, FiVideo } from 'react-icons/fi';

const formatSlides = [
  {
    title: 'Courses',
    description: 'Comprehensive, self-paced learning paths for deep skill building.',
    points: ['Quizzes', 'Assignments', 'Videos', 'Articles'],
    icon: FiBookOpen,
    route: '/academy/courses'
  },
  {
    title: 'Seminars',
    description: 'Live sessions covering focused freelance and career topics.',
    points: ['Live sessions', 'Topic deep dives', 'Q&A segments', 'Expert speakers'],
    icon: FiCalendar,
    route: '/academy/seminars'
  },
  {
    title: 'Tutorials',
    description: 'Short, practical lessons for fast wins and quick upskilling.',
    points: ['Video or article', 'Short format', 'Downloadable resources', 'Action steps'],
    icon: FiVideo,
    route: '/academy/tutorials'
  },
  {
    title: 'Podcasts',
    description: 'Video podcasts discussing trends, workflows, and real-world strategy.',
    points: ['Video podcasts', 'Industry conversations', 'Practical takeaways', 'On-demand playback'],
    icon: FiMic,
    route: null
  }
];

function AcademyFormatsCarousel() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideStep, setSlideStep] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const carouselWindowRef = useRef(null);

  const handleNextSlide = () => {
    if (formatSlides.length <= 1) {
      return;
    }

    setActiveSlide((prev) => (prev + 1) % formatSlides.length);
  };

  const handlePrevSlide = () => {
    if (formatSlides.length <= 1) {
      return;
    }

    setActiveSlide((prev) => (prev - 1 + formatSlides.length) % formatSlides.length);
  };

  useEffect(() => {
    if (isPaused || formatSlides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % formatSlides.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  useEffect(() => {
    const updateSlideStep = () => {
      if (!carouselWindowRef.current) {
        return;
      }

      const windowWidth = carouselWindowRef.current.clientWidth;
      const isCompact = window.matchMedia('(max-width: 768px)').matches;
      const peek = isCompact ? 24 : 120;
      const gap = isCompact ? 12 : 16;
      const nextStep = Math.max(windowWidth - peek + gap, windowWidth * 0.6);

      setSlideStep(nextStep);
    };

    updateSlideStep();
    window.addEventListener('resize', updateSlideStep);

    return () => window.removeEventListener('resize', updateSlideStep);
  }, []);

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null) {
      setIsPaused(false);
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (deltaX > swipeThreshold) {
      handleNextSlide();
    } else if (deltaX < -swipeThreshold) {
      handlePrevSlide();
    }

    setTouchStartX(null);
    setIsPaused(false);
  };

  const handleFormatSelect = (slide) => {
    if (!slide.route) {
      return;
    }

    navigate(slide.route);
  };

  return (
    <section className="my-6 mb-8 rounded-[30px] p-8 bg-light-tertiary border border-border shadow-card backdrop-blur-[8px] md:p-6" aria-label="Learning format highlights">
      <div className="mb-5">
        <span className="inline-block uppercase text-[11px] font-bold tracking-[2px] text-accent mb-1.5">Explore Formats</span>
        <h3 className="text-[30px] text-dark-primary md:text-2xl">Choose how you want to learn</h3>
      </div>

      <div
        className="overflow-hidden"
        ref={carouselWindowRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-4 transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeSlide * slideStep}px)` }}>
          {formatSlides.map((slide) => {
            const Icon = slide.icon;

            return (
              <article
                className={`flex-[0_0_calc(100%-120px)] min-w-[calc(100%-120px)] rounded-2xl p-6 border border-border bg-main-bg md:flex-[0_0_calc(100%-24px)] md:min-w-[calc(100%-24px)] md:p-[22px] ${slide.route ? 'cursor-pointer transition-all duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:border-accent/50 hover:shadow-card-hover focus-visible:-translate-y-[3px] focus-visible:border-accent/50 focus-visible:shadow-card-hover focus-visible:outline-none' : 'cursor-default'}`}
                key={slide.title}
                role={slide.route ? 'button' : undefined}
                tabIndex={slide.route ? 0 : -1}
                onClick={() => handleFormatSelect(slide)}
                onKeyDown={(event) => {
                  if (!slide.route) {
                    return;
                  }

                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleFormatSelect(slide);
                  }
                }}
                aria-label={slide.route ? `Open ${slide.title}` : `${slide.title} coming soon`}
              >
                <span className="w-11 h-11 rounded-md inline-flex items-center justify-center text-[#111] bg-light-secondary mb-3" aria-hidden="true">
                  <Icon className="w-5 h-5" strokeWidth={2.1} />
                </span>
                <h4 className="text-[26px] text-dark-primary mb-2">{slide.title}</h4>
                <p className="text-md leading-[1.6] text-dark-secondary mb-4">{slide.description}</p>
                <div className="flex flex-wrap gap-2">
                  {slide.points.map((point) => (
                    <span key={point} className="inline-flex py-1.5 px-[11px] rounded-full text-[11px] font-bold tracking-[0.4px] text-[#666] bg-light-secondary border border-border">
                      {point}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4" aria-label="Format carousel controls and indicators">
        <button className="w-[38px] h-[38px] inline-flex items-center justify-center border border-border rounded-full bg-light-tertiary text-dark-primary cursor-pointer transition-all duration-[250ms] ease-in-out hover:-translate-y-px hover:border-[rgba(27,36,50,0.32)]" onClick={handlePrevSlide} aria-label="Previous format slide">
          <svg className="w-[18px] h-[18px] stroke-current" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex gap-2 justify-center" aria-label="Format slide indicators">
          {formatSlides.map((slide, index) => (
            <button
              key={slide.title}
              className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all duration-[250ms] ease-in-out ${activeSlide === index ? 'bg-accent scale-[1.2]' : 'bg-dark-primary/[0.28]'}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to format slide ${index + 1}`}
            />
          ))}
        </div>
        <button className="w-[38px] h-[38px] inline-flex items-center justify-center border border-border rounded-full bg-light-tertiary text-dark-primary cursor-pointer transition-all duration-[250ms] ease-in-out hover:-translate-y-px hover:border-[rgba(27,36,50,0.32)]" onClick={handleNextSlide} aria-label="Next format slide">
          <svg className="w-[18px] h-[18px] stroke-current" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default AcademyFormatsCarousel;
