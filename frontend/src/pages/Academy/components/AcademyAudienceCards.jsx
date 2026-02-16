import React from 'react';
import PropTypes from 'prop-types';
import { FiDollarSign, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';

function AcademyAudienceCards({ onBrowseCourses, onCreateContent }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <div className="bg-academy-surface/95 rounded-2xl p-10 flex flex-col border border-[rgba(31,31,36,0.07)] shadow-[0_14px_30px_rgba(17,22,30,0.07)] transition-all duration-[350ms] ease-in-out relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-1.5 before:bg-[linear-gradient(90deg,rgba(244,102,62,0.22)_0%,rgba(244,102,62,1)_18%,rgba(244,102,62,1)_82%,rgba(244,102,62,0.22)_100%)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(17,22,30,0.1)] md:p-[34px_26px]">
        <div className="rounded-[14px] overflow-hidden mb-4 border border-[rgba(27,36,50,0.08)]">
          <img
            className="w-full h-[172px] block object-cover"
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
            alt="Learners collaborating around laptops"
            loading="lazy"
          />
        </div>
        <span className="inline-block uppercase tracking-[2.3px] text-xs font-bold text-accent mb-4">For Learners</span>
        <h2 className="text-4xl leading-[1.2] text-academy-deep mb-4 md:text-[26px]">Master freelancing skills</h2>
        <p className="text-md leading-[1.68] text-academy-deep-secondary mb-5">
          Follow curated paths designed by working freelancers. Practice with real scenarios,
          get mentor feedback, and move from learning mode to earning mode faster.
        </p>

        <div className="flex flex-wrap gap-2 mb-6 min-h-[56px] md:min-h-0" aria-label="Learner highlights">
          <span className="inline-flex items-center py-1.5 px-[11px] rounded-full text-[11px] font-bold tracking-[0.4px] uppercase text-academy-deep-tertiary bg-white/[0.58] border border-[rgba(27,36,50,0.08)]">Structured roadmap</span>
          <span className="inline-flex items-center py-1.5 px-[11px] rounded-full text-[11px] font-bold tracking-[0.4px] uppercase text-academy-deep-tertiary bg-white/[0.58] border border-[rgba(27,36,50,0.08)]">Skill drills</span>
          <span className="inline-flex items-center py-1.5 px-[11px] rounded-full text-[11px] font-bold tracking-[0.4px] uppercase text-academy-deep-tertiary bg-white/[0.58] border border-[rgba(27,36,50,0.08)]">Portfolio outcomes</span>
        </div>

        <div className="flex flex-col gap-4 mb-8 flex-grow">
          <div className="flex gap-4 items-center bg-white/60 rounded-[14px] py-4 px-5 border border-[rgba(27,36,50,0.08)]">
            <span className="w-10 h-10 shrink-0 rounded-[10px] bg-academy-surface/[0.68] flex items-center justify-center text-xl text-[#111]" aria-hidden="true">
              <FiTarget className="block w-[18px] h-[18px] text-[#111] stroke-[#111]" strokeWidth={2.2} />
            </span>
            <div>
              <h4 className="text-base font-semibold text-academy-deep mb-1">Skill-by-skill progression</h4>
              <p className="text-sm text-academy-deep-secondary leading-normal">Clear milestones help you build confidence from fundamentals to delivery.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center bg-white/60 rounded-[14px] py-4 px-5 border border-[rgba(27,36,50,0.08)]">
            <span className="w-10 h-10 shrink-0 rounded-[10px] bg-academy-surface/[0.68] flex items-center justify-center text-xl text-[#111]" aria-hidden="true">
              <FiTrendingUp className="block w-[18px] h-[18px] text-[#111] stroke-[#111]" strokeWidth={2.2} />
            </span>
            <div>
              <h4 className="text-base font-semibold text-academy-deep mb-1">Proof you can show clients</h4>
              <p className="text-sm text-academy-deep-secondary leading-normal">Turn each lesson into practical artifacts that strengthen your profile.</p>
            </div>
          </div>
        </div>

        <button className="bg-accent text-white border-none py-3.5 text-md font-semibold rounded-[10px] cursor-pointer transition-all duration-[250ms] ease-in-out w-full hover:-translate-y-0.5 hover:bg-accent-tertiary hover:shadow-[0_12px_24px_rgba(244,102,62,0.2)]" onClick={onBrowseCourses}>
          Start Learning
        </button>
      </div>

      <div className="bg-academy-surface/95 rounded-2xl p-10 flex flex-col border border-[rgba(31,31,36,0.07)] shadow-[0_14px_30px_rgba(17,22,30,0.07)] transition-all duration-[350ms] ease-in-out relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-1.5 before:bg-[linear-gradient(90deg,rgba(244,102,62,0.22)_0%,rgba(244,102,62,1)_18%,rgba(244,102,62,1)_82%,rgba(244,102,62,0.22)_100%)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(17,22,30,0.1)] md:p-[34px_26px]">
        <div className="rounded-[14px] overflow-hidden mb-4 border border-[rgba(27,36,50,0.08)]">
          <img
            className="w-full h-[172px] block object-cover"
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
            alt="Presenter teaching a seminar to a group"
            loading="lazy"
          />
        </div>
        <span className="inline-block uppercase tracking-[2.3px] text-xs font-bold text-accent mb-4">For Creators</span>
        <h2 className="text-4xl leading-[1.2] text-academy-deep mb-4 md:text-[26px]">Share your expertise</h2>
        <p className="text-md leading-[1.68] text-academy-deep-secondary mb-5">
          Teach what you know through courses, seminars, and tutorials that are easy to launch.
          Grow your authority, help learners succeed, and create recurring income.
        </p>

        <div className="flex flex-wrap gap-2 mb-6 min-h-[56px] md:min-h-0" aria-label="Creator highlights">
          <span className="inline-flex items-center py-1.5 px-[11px] rounded-full text-[11px] font-bold tracking-[0.4px] uppercase text-academy-deep-tertiary bg-white/[0.58] border border-[rgba(27,36,50,0.08)]">Creator toolkit</span>
          <span className="inline-flex items-center py-1.5 px-[11px] rounded-full text-[11px] font-bold tracking-[0.4px] uppercase text-academy-deep-tertiary bg-white/[0.58] border border-[rgba(27,36,50,0.08)]">Audience growth</span>
          <span className="inline-flex items-center py-1.5 px-[11px] rounded-full text-[11px] font-bold tracking-[0.4px] uppercase text-academy-deep-tertiary bg-white/[0.58] border border-[rgba(27,36,50,0.08)]">Revenue options</span>
        </div>

        <div className="flex flex-col gap-4 mb-8 flex-grow">
          <div className="flex gap-4 items-center bg-white/60 rounded-[14px] py-4 px-5 border border-[rgba(27,36,50,0.08)]">
            <span className="w-10 h-10 shrink-0 rounded-[10px] bg-academy-surface/[0.68] flex items-center justify-center text-xl text-[#111]" aria-hidden="true">
              <FiZap className="block w-[18px] h-[18px] text-[#111] stroke-[#111]" strokeWidth={2.2} />
            </span>
            <div>
              <h4 className="text-base font-semibold text-academy-deep mb-1">Build authority with consistency</h4>
              <p className="text-sm text-academy-deep-secondary leading-normal">Publish with a repeatable format that keeps your content polished.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center bg-white/60 rounded-[14px] py-4 px-5 border border-[rgba(27,36,50,0.08)]">
            <span className="w-10 h-10 shrink-0 rounded-[10px] bg-academy-surface/[0.68] flex items-center justify-center text-xl text-[#111]" aria-hidden="true">
              <FiDollarSign className="block w-[18px] h-[18px] text-[#111] stroke-[#111]" strokeWidth={2.2} />
            </span>
            <div>
              <h4 className="text-base font-semibold text-academy-deep mb-1">Monetize expertise your way</h4>
              <p className="text-sm text-academy-deep-secondary leading-normal">Mix free and paid formats to scale impact and sustainable earnings.</p>
            </div>
          </div>
        </div>

        <button className="bg-accent text-white border-none py-3.5 text-md font-semibold rounded-[10px] cursor-pointer transition-all duration-[250ms] ease-in-out w-full hover:-translate-y-0.5 hover:bg-accent-tertiary hover:shadow-[0_12px_24px_rgba(244,102,62,0.2)]" onClick={onCreateContent}>
          Start Creating
        </button>
      </div>
    </div>
  );
}

AcademyAudienceCards.propTypes = {
  onBrowseCourses: PropTypes.func,
  onCreateContent: PropTypes.func,
};

export default AcademyAudienceCards;
