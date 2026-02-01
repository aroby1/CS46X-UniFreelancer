/* global process */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const COLLAPSED_VISIBLE_ITEMS = 2;
// Keep this in sync with `.item-list li { height: ... }` in Profile.css
const COLLAPSED_ROW_HEIGHT = 44;
const COLLAPSED_LIST_MAX_HEIGHT = COLLAPSED_VISIBLE_ITEMS * COLLAPSED_ROW_HEIGHT;

function CollapsibleListSection({
    title,
    items,
    emptyText,
    itemToLabel,
    itemToKey,
    onItemClick,
}) {
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const listRef = useRef(null);

    const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

    const measure = useCallback(() => {
        if (!listRef.current) return;
        setContentHeight(listRef.current.scrollHeight || 0);
    }, []);

    useEffect(() => {
        // Measure after paint so scrollHeight is accurate.
        const raf = window.requestAnimationFrame(measure);
        const onResize = () => measure();
        window.addEventListener('resize', onResize);
        return () => {
            window.cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
        };
    }, [measure, safeItems.length]);

    const maxHeightPx = safeItems.length === 0
        ? 0
        : (expanded ? (contentHeight || COLLAPSED_LIST_MAX_HEIGHT) : COLLAPSED_LIST_MAX_HEIGHT);

    const minHeightPx = safeItems.length > 0 && !expanded ? COLLAPSED_LIST_MAX_HEIGHT : 0;
    const bodyMinHeightPx = !expanded ? COLLAPSED_LIST_MAX_HEIGHT : 0;

    const showToggle = safeItems.length > COLLAPSED_VISIBLE_ITEMS;

    return (
        <div className="profile-section">
            <div className="profile-section-header">
                <h3>{title}</h3>
                {showToggle && (
                    <button
                        type="button"
                        className="profile-section-toggle"
                        onClick={() => setExpanded(prev => !prev)}
                        aria-expanded={expanded}
                        aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
                    >
                        <span className={`profile-chevron ${expanded ? 'is-expanded' : ''}`} />
                    </button>
                )}
            </div>

            {safeItems.length > 0 ? (
                <div
                    className="profile-collapsible"
                    style={{ maxHeight: `${maxHeightPx}px`, minHeight: `${minHeightPx}px` }}
                >
                    <ul ref={listRef} className="item-list">
                        {safeItems.map((item) => {
                            const key = itemToKey(item);
                            const label = itemToLabel(item);
                            const clickable = typeof onItemClick === 'function';
                            return (
                                <li key={key}>
                                    {clickable ? (
                                        <button
                                            type="button"
                                            className="profile-item-link"
                                            onClick={() => onItemClick(item)}
                                        >
                                            {label}
                                        </button>
                                    ) : (
                                        <span className="profile-item-text">{label}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <div className="profile-empty" style={{ height: `${bodyMinHeightPx}px` }}>
                    <p className="empty-state">{emptyText}</p>
                </div>
            )}
        </div>
    );
}

CollapsibleListSection.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    emptyText: PropTypes.string,
    itemToLabel: PropTypes.func,
    itemToKey: PropTypes.func,
    onItemClick: PropTypes.func,
};

CollapsibleListSection.defaultProps = {
    items: [],
    emptyText: "No items yet.",
    itemToLabel: (item) => item.label || item.title || String(item),
    itemToKey: (item) => item.id || item._id || String(item),
    onItemClick: null,
};

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                // Fetch authenticated user's profile directly
                const response = await fetch(`${apiUrl}/api/users/profile`, {
                    credentials: 'include' // Send cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else if (response.status === 401) {
                    // Not authenticated
                    navigate('/login');
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSignOut = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            await fetch(`${apiUrl}/api/users/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            navigate('/login');
            window.location.reload();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (loading) {
        return <div className="profile-container">Loading...</div>;
    }

    if (!user) {
        return <div className="profile-container">User not found</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.firstName && user.firstName.charAt(0).toUpperCase()}
                </div>
                <h2>{user.firstName} {user.lastName}</h2>
                <p className="profile-username">@{user.username}</p>
                <p className="profile-email">{user.email}</p>
                <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
            </div>

            <div className="profile-content">
                <CollapsibleListSection
                    title="Enrolled Courses"
                    items={user.enrolledCourses}
                    emptyText="No enrolled courses yet."
                    itemToKey={(course) => course?._id || course?.id || course?.title}
                    itemToLabel={(course) => course?.title || 'Untitled course'}
                    onItemClick={(course) => {
                        const id = course?._id || course?.id;
                        if (id) navigate(`/academy/courses/${id}`);
                    }}
                />

                <CollapsibleListSection
                    title="Registered Seminars"
                    items={user.registeredSeminars}
                    emptyText="No registered seminars yet."
                    itemToKey={(seminar) => seminar?._id || seminar?.id || seminar?.title}
                    itemToLabel={(seminar) => seminar?.title || 'Untitled seminar'}
                />

                <CollapsibleListSection
                    title="Completed Tutorials"
                    items={user.completedTutorials}
                    emptyText="No completed tutorials yet."
                    itemToKey={(tutorial) => tutorial?._id || tutorial?.id || tutorial?.title}
                    itemToLabel={(tutorial) => tutorial?.title || 'Untitled tutorial'}
                    onItemClick={(tutorial) => {
                        const id = tutorial?._id || tutorial?.id;
                        if (id) navigate(`/academy/tutorials/${id}`);
                    }}
                />

                <CollapsibleListSection
                    title="Saved Podcasts"
                    items={user.savedPodcasts}
                    emptyText="No saved podcasts yet."
                    itemToKey={(podcast) => podcast?._id || podcast?.id || podcast?.title}
                    itemToLabel={(podcast) => podcast?.title || 'Untitled podcast'}
                />
            </div>
        </div>
    );
};

export default Profile;
