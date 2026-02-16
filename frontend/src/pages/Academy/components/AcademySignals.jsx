import React from 'react';

function AcademySignals() {
  return (
    <section className="my-8 mb-10 flex flex-wrap gap-2.5 relative z-[2] md:gap-2" aria-label="Academy outcomes">
      <div className="rounded-full py-2.5 px-3.5 bg-light-tertiary border border-border text-dark-primary text-xs font-bold uppercase tracking-[0.5px] md:text-[11px]">
        Expert-led live sessions
      </div>
      <div className="rounded-full py-2.5 px-3.5 bg-light-tertiary border border-border text-dark-primary text-xs font-bold uppercase tracking-[0.5px] md:text-[11px]">
        Certificate-ready milestones
      </div>
      <div className="rounded-full py-2.5 px-3.5 bg-light-tertiary border border-border text-dark-primary text-xs font-bold uppercase tracking-[0.5px] md:text-[11px]">
        Community backed accountability
      </div>
    </section>
  );
}

export default AcademySignals;
