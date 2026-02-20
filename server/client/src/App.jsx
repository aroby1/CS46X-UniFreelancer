function Header({ user }) {
  const location = useLocation();

  // Function to check if link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">
            <h1>UniFreelancer</h1>
            <p>FREELANCE PORTAL</p>
          </Link>
        </div>
        <nav className="nav">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/find-work" className={isActive('/find-work')}>Find Work</Link>
          <Link to="/browse-freelancers" className={isActive('/browse-freelancers')}>Browse Freelancers</Link>
          <Link to="/hire-talent" className={isActive('/hire-talent')}>Hire Talent</Link>
          <Link to="/academy" className={isActive('/academy')}>UF Academy</Link>
          <Link to="/social" className={isActive('/social')}>UF Social</Link>
          <Link to="/about" className={isActive('/about')}>About Us</Link>
          <Link to="/inbox" className={isActive('/inbox')}>Inbox</Link>

          {/* ADD THIS: Instructor Dashboard Link - Only for instructors */}
          {user && user.accountType === 'instructor' && (
            <Link 
              to="/instructor/dashboard" 
              className={`instructor-dashboard-link ${isActive('/instructor/dashboard')}`}
            >
              📊 Dashboard
            </Link>
          )}

          {user ? (
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" className={`user-profile-link ${isActive('/profile')}`}>
                <div className="nav-profile-avatar">
                  {user.firstName && user.firstName.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/signup" className={isActive('/signup')}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}