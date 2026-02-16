import React from 'react';
import PropTypes from 'prop-types';

function AcademyHero({ onBrowseCourses, onCreateContent }) {
  return (
    <section className="relative py-12 pb-5">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] gap-6 items-center">
        <div className="max-w-[820px] animate-hero-reveal">
          <span className="inline-flex items-center uppercase tracking-[2.4px] text-base font-bold text-accent bg-accent/[0.08] border border-accent/[0.16] rounded-full py-3 px-4 mb-4">
            UniFreelancer Academy
          </span>
          <h1 className="text-[clamp(2.2rem,5.2vw,3.95rem)] font-bold text-dark-primary leading-none tracking-tight mb-5 text-balance lg:text-[46px] md:text-[34px]">
            Build a freelancing career with confidence.
          </h1>
          <p className="text-lg leading-[1.78] text-dark-secondary max-w-[730px] mb-8 md:text-base">
            UniFreelancer cares about education and continued support for university students and
            alumni entering or already working in the freelance industry. The UniFreelancer Academy
            offers courses, workshops and tutorials to help make you a better freelancer!
          </p>
          <div className="flex gap-4 flex-wrap mb-8 md:flex-col md:items-stretch">
            <button
              className="rounded-full py-3 px-[22px] text-sm font-semibold border-none cursor-pointer transition-all duration-300 bg-gradient-to-br from-accent to-accent-secondary text-white shadow-[0_12px_24px_rgba(244,102,62,0.16)] hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(244,102,62,0.22)] md:w-full"
              onClick={onBrowseCourses}
            >
              Browse Courses
            </button>
            <button
              className="rounded-full py-3 px-[22px] text-sm font-semibold cursor-pointer transition-all duration-300 bg-light-tertiary text-dark-primary border border-[rgba(27,36,50,0.1)] hover:-translate-y-0.5 hover:border-[rgba(27,36,50,0.3)] md:w-full"
              onClick={onCreateContent}
            >
              Create Content
            </button>
          </div>
        </div>

        <div className="relative min-h-[390px] lg:min-h-[340px] md:min-h-[300px] md:max-w-[520px]" aria-hidden="true">
          <div className="absolute overflow-hidden rounded-[26px] border border-border shadow-card-hover w-[72%] h-[320px] right-0 top-[34px] rotate-2 md:w-[74%] md:h-[250px] md:top-[46px]">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
              alt=""
              loading="lazy"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="absolute overflow-hidden rounded-[26px] border border-border shadow-card-hover w-[46%] h-[178px] left-0 top-0 -rotate-[4deg] md:w-[48%] md:h-[150px]">
            <img
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80"
              alt=""
              loading="lazy"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="absolute overflow-hidden rounded-[26px] border border-border shadow-card-hover w-[46%] h-[178px] left-[4%] bottom-0 rotate-3 md:w-[48%] md:h-[150px]">
            <img
              src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=900&q=80"
              alt=""
              loading="lazy"
              className="w-full h-full object-cover block"
            />
          </div>
          <span className="absolute z-[3] inline-flex items-center py-2 px-3 rounded-full text-[10px] font-bold tracking-[0.4px] uppercase text-dark-primary bg-light-tertiary border border-border shadow-card top-[14px] right-[6px] animate-nudge-float">
            Self-paced learning
          </span>
          <span className="absolute z-[3] inline-flex items-center py-2 px-3 rounded-full text-[10px] font-bold tracking-[0.4px] uppercase text-dark-primary bg-light-tertiary border border-border shadow-card left-[10px] -bottom-2 animate-[nudge-float_6.4s_ease-in-out_infinite]">
            Creator-led sessions
          </span>
        </div>
      </div>
    </section>
  );
}

AcademyHero.propTypes = {
  onBrowseCourses: PropTypes.func,
  onCreateContent: PropTypes.func,
};

export default AcademyHero;
