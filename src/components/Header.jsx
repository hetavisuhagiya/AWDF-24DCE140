function Header({ name }) {
  return (
    <header className="hero-card">
      <h1>{name}</h1>
      <h3>Student Portfolio</h3>
      <p>Building modern web experiences with creativity, code, and curiosity.</p>

      <div className="hero-badges">
        <span>React Developer</span>
        <span>UI Enthusiast</span>
        <span>Problem Solver</span>
      </div>
    </header>
  );
}

export default Header;