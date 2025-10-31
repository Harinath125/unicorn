function Header() {
  try {
    return (
      <header className="bg-white shadow-sm border-b border-[var(--border-color)]" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center overflow-hidden">
                <img src="https://app.trickle.so/storage/public/images/usr_1498ae64b0000001/30e23543-8bb9-4613-9046-e15afdd88d21.jpeg" alt="UniQuorn Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">UniQuorn</h1>
                <p className="text-sm text-[var(--text-secondary)]">Therapy Management System</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                Features
              </a>
              <a href="#about" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                About
              </a>
              <a href="#contact" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}