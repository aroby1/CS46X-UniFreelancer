import React, { useEffect, useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function AcademyPlans() {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkSignedIn = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/users/me`, {
          credentials: 'include'
        });
        setIsSignedIn(response.ok);
      } catch (error) {
        setIsSignedIn(false);
      }
    };

    checkSignedIn();
  }, []);

  const handleFreeSelect = () => {
    if (!isSignedIn) {
      navigate('/signup');
    }
  };

  return (
    <section className="academy-plans" aria-label="Subscription plans">
      <div className="plans-header">
        <span className="showcase-kicker">Subscriptions</span>
        <h3>Pick the plan that fits your pace</h3>
        <p>Start free, then upgrade when you want deeper access and more live experiences.</p>
      </div>

      <div className="plans-grid">
        <article
          className={`plan-card plan-free ${!isSignedIn ? 'is-clickable' : ''}`}
          onClick={handleFreeSelect}
          role={!isSignedIn ? 'button' : undefined}
          tabIndex={!isSignedIn ? 0 : -1}
          onKeyDown={(event) => {
            if (isSignedIn) {
              return;
            }

            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleFreeSelect();
            }
          }}
          aria-label={!isSignedIn ? 'Sign up for free plan' : 'Free plan'}
        >
          <h4>Free</h4>
          <p className="plan-price">$0/mo</p>
          <p className="plan-subtitle">Great for getting started</p>
          <ul className="plan-features">
            <li><FiCheck aria-hidden="true" />Access to selected tutorials</li>
            <li><FiCheck aria-hidden="true" />Basic course previews</li>
            <li><FiCheck aria-hidden="true" />Community announcements</li>
            <li><FiCheck aria-hidden="true" />Limited resource downloads</li>
          </ul>
          <button className="plan-button ghost" onClick={handleFreeSelect}>
            Start Free
          </button>
        </article>

        <article className="plan-card plan-plus featured">
          <span className="plan-badge">Most popular</span>
          <h4>Plus</h4>
          <p className="plan-price">$19/mo</p>
          <p className="plan-subtitle">Best for active learners</p>
          <ul className="plan-features">
            <li><FiCheck aria-hidden="true" />Full course and tutorial library</li>
            <li><FiCheck aria-hidden="true" />Weekly live seminar access</li>
            <li><FiCheck aria-hidden="true" />Downloadable templates/resources</li>
            <li><FiCheck aria-hidden="true" />Priority support updates</li>
          </ul>
          <button className="plan-button primary">Choose Plus</button>
        </article>

        <article className="plan-card plan-premium">
          <h4>Premium</h4>
          <p className="plan-price">$39/mo</p>
          <p className="plan-subtitle">For creators and power users</p>
          <ul className="plan-features">
            <li><FiCheck aria-hidden="true" />Everything in Plus</li>
            <li><FiCheck aria-hidden="true" />Advanced creator tools</li>
            <li><FiCheck aria-hidden="true" />Early access to new releases</li>
            <li><FiCheck aria-hidden="true" />Exclusive premium sessions</li>
          </ul>
          <button className="plan-button secondary">Go Premium</button>
        </article>
      </div>
    </section>
  );
}

export default AcademyPlans;
