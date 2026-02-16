import React from 'react';
import { FiCompass, FiStar, FiTool, FiUsers } from 'react-icons/fi';

function AcademyBenefits() {
  return (
    <section className="bg-academy-surface/95 rounded-[30px] p-10 border border-[rgba(31,31,36,0.07)] shadow-[0_18px_36px_rgba(17,22,30,0.07)] md:p-7">
      <div className="mb-8">
        <div className="max-w-[640px] mb-0">
          <h3 className="text-3xl text-academy-deep mb-3">Why Academy works</h3>
          <p className="text-academy-deep-secondary text-base leading-[1.6]">
            A focused learning environment that blends guided curriculum, practical delivery,
            and community momentum.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-[18px] p-5 border border-[rgba(27,36,50,0.06)] transition-all duration-[350ms] ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(27,36,50,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex w-11 h-11 rounded-[14px] items-center justify-center bg-transparent text-xl text-[#111]" aria-hidden="true">
              <FiCompass className="block w-5 h-5" strokeWidth={2.1} />
            </span>
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.9px] text-accent">Learning Design</span>
          </div>
          <h4 className="text-base text-academy-deep mb-2">Guided, not overwhelming</h4>
          <p className="text-sm text-academy-deep-secondary leading-[1.6]">Roadmaps remove guesswork so you can focus on progress, not planning.</p>
        </div>
        <div className="bg-white rounded-[18px] p-5 border border-[rgba(27,36,50,0.06)] transition-all duration-[350ms] ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(27,36,50,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex w-11 h-11 rounded-[14px] items-center justify-center bg-transparent text-xl text-[#111]" aria-hidden="true">
              <FiTool className="block w-5 h-5" strokeWidth={2.1} />
            </span>
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.9px] text-accent">Hands-On</span>
          </div>
          <h4 className="text-base text-academy-deep mb-2">Practice tied to outcomes</h4>
          <p className="text-sm text-academy-deep-secondary leading-[1.6]">Every module ends with project output you can use in real client work.</p>
        </div>
        <div className="bg-white rounded-[18px] p-5 border border-[rgba(27,36,50,0.06)] transition-all duration-[350ms] ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(27,36,50,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex w-11 h-11 rounded-[14px] items-center justify-center bg-transparent text-xl text-[#111]" aria-hidden="true">
              <FiStar className="block w-5 h-5" strokeWidth={2.1} />
            </span>
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.9px] text-accent">Career Lift</span>
          </div>
          <h4 className="text-base text-academy-deep mb-2">Signal your capabilities</h4>
          <p className="text-sm text-academy-deep-secondary leading-[1.6]">Show badges, deliverables, and progress artifacts that build trust fast.</p>
        </div>
        <div className="bg-white rounded-[18px] p-5 border border-[rgba(27,36,50,0.06)] transition-all duration-[350ms] ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(27,36,50,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex w-11 h-11 rounded-[14px] items-center justify-center bg-transparent text-xl text-[#111]" aria-hidden="true">
              <FiUsers className="block w-5 h-5" strokeWidth={2.1} />
            </span>
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.9px] text-accent">Community</span>
          </div>
          <h4 className="text-base text-academy-deep mb-2">Momentum from peers</h4>
          <p className="text-sm text-academy-deep-secondary leading-[1.6]">Stay accountable with creators and learners sharing wins each week.</p>
        </div>
      </div>
    </section>
  );
}

export default AcademyBenefits;
