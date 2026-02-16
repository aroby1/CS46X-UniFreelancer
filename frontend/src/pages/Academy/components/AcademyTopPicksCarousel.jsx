import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

function AcademyTopPicksCarousel({ featuredLoading, featuredTracks }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideStep, setSlideStep] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const carouselWindowRef = useRef(null);

  const handleNextSlide = () => {
    if (featuredTracks.length <= 1) {
      return;
    }

    setActiveSlide((prev) => (prev + 1) % featuredTracks.length);
  };

  const handlePrevSlide = () => {
    if (featuredTracks.length <= 1) {
      return;
    }

    setActiveSlide((prev) => (prev - 1 + featuredTracks.length) % featuredTracks.length);
  };

  useEffect(() => {
    if (isPaused || featuredTracks.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredTracks.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [featuredTracks.length, isPaused]);

  useEffect(() => {
    if (featuredTracks.length === 0) {
      setActiveSlide(0);
      return;
    }

    if (activeSlide > featuredTracks.length - 1) {
      setActiveSlide(0);
    }
  }, [activeSlide, featuredTracks.length]);

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

  return (
    <section className="my-10 mb-8 rounded-[30px] p-8 bg-light-tertiary border border-border shadow-card backdrop-blur-[8px] relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-full before:bg-[linear-gradient(180deg,rgba(244,102,62,0.22)_0%,rgba(244,102,62,1)_16%,rgba(244,102,62,1)_84%,rgba(244,102,62,0.22)_100%)] md:p-6" aria-label="Featured learning carousel">
      <div className="flex justify-start items-end gap-5 mb-6 md:flex-col md:items-start">
        <div>
          <span className="inline-block uppercase text-[11px] font-bold tracking-[2px] text-accent mb-1.5">Top Picks</span>
          <h3 className="text-[30px] text-dark-primary md:text-2xl">Current academy highlights</h3>
        </div>
      </div>

      {featuredLoading ? (
        <p className="py-[30px] px-[18px] text-center text-dark-secondary text-md rounded-lg bg-light-secondary border border-border">Loading top picks...</p>
      ) : featuredTracks.length === 0 ? (
        <p className="py-[30px] px-[18px] text-center text-dark-secondary text-md rounded-lg bg-light-secondary border border-border">No top picks are available yet.</p>
      ) : (
        <>
          <div
            className="overflow-hidden"
            ref={carouselWindowRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex gap-4 transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeSlide * slideStep}px)` }}>
              {featuredTracks.map((track, index) => (
                <article
                  className={`flex-[0_0_calc(100%-120px)] min-w-[calc(100%-120px)] rounded-2xl p-8 border border-border grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-5 items-center md:flex-[0_0_calc(100%-24px)] md:min-w-[calc(100%-24px)] md:p-[22px] ${track.accent.toLowerCase() === 'warm' ? 'bg-light-secondary' : track.accent.toLowerCase() === 'deep' ? 'bg-light-secondary' : 'bg-light-secondary'}`}
                  key={`${track.id || track.title}-${index}`}
                >
                  <div className="min-w-0">
                    <span className="inline-flex py-1.5 px-[11px] rounded-full text-[11px] uppercase tracking-[1px] font-bold mb-4 bg-light-secondary text-dark-primary">{track.label}</span>
                    <h4 className="text-3xl text-dark-primary mb-4 max-w-[700px] md:text-2xl">{track.title}</h4>
                    <div className="flex gap-2.5 flex-wrap mb-4">
                      <span className="text-xs py-1.5 px-2.5 rounded-full bg-light-secondary text-[#666]">{track.level}</span>
                      <span className="text-xs py-1.5 px-2.5 rounded-full bg-light-secondary text-[#666]">{track.metaDetail}</span>
                    </div>
                    <p className="text-base leading-[1.7] text-dark-secondary max-w-[760px] mb-5">{track.outcome}</p>
                    <button className="border-none rounded-full py-[11px] px-[18px] text-sm font-semibold bg-accent text-white cursor-pointer transition-all duration-[250ms] ease-in-out hover:-translate-y-0.5 hover:bg-accent-tertiary hover:shadow-[0_10px_20px_rgba(244,102,62,0.28)]" type="button">
                      View Program
                    </button>
                  </div>
                  <div className="h-[230px] rounded-lg overflow-hidden border border-border shadow-card lg:block md:h-[186px] md:-order-1">
                    <img src={track.image} alt={track.imageAlt} loading="lazy" className="w-full h-full object-cover block" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4" aria-label="Carousel controls and indicators">
            <button className="w-[38px] h-[38px] inline-flex items-center justify-center border border-border rounded-full bg-light-tertiary text-dark-primary cursor-pointer transition-all duration-[250ms] ease-in-out hover:-translate-y-px hover:border-[rgba(27,36,50,0.32)]" onClick={handlePrevSlide} aria-label="Previous slide">
              <svg className="w-[18px] h-[18px] stroke-current" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="flex gap-2 justify-center" aria-label="Slide indicators">
              {featuredTracks.map((track, index) => (
                <button
                  key={`${track.id || track.title}-${index}`}
                  className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all duration-[250ms] ease-in-out ${activeSlide === index ? 'bg-accent scale-[1.2]' : 'bg-dark-primary/[0.28]'}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button className="w-[38px] h-[38px] inline-flex items-center justify-center border border-border rounded-full bg-light-tertiary text-dark-primary cursor-pointer transition-all duration-[250ms] ease-in-out hover:-translate-y-px hover:border-[rgba(27,36,50,0.32)]" onClick={handleNextSlide} aria-label="Next slide">
              <svg className="w-[18px] h-[18px] stroke-current" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </>
      )}
    </section>
  );
}

AcademyTopPicksCarousel.propTypes = {
  featuredLoading: PropTypes.bool,
  featuredTracks: PropTypes.array,
};

export default AcademyTopPicksCarousel;
