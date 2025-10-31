function DashboardHeader({ user, title }) {
  try {
    return (
      <header className="header-gradient shadow-lg border-b border-[var(--border-color)] px-6 py-4 animate-fade-in-left" data-name="dashboard-header" data-file="components/DashboardHeader.js">
        <div className="flex items-center justify-between">
          <div className="animate-bounce-in">
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h1>
            <p className="text-sm text-[var(--text-secondary)]">Welcome back, {user.name}</p>
          </div>
          
          <div className="flex items-center gap-4 animate-fade-in-right">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] glass-morphism px-3 py-2 rounded-lg">
              <div className="icon-clock text-lg"></div>
              {new Date().toLocaleDateString()}
            </div>
            
            <div className="flex items-center gap-2 glass-morphism px-3 py-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-purple-600 flex items-center justify-center animate-pulse-glow">
                <div className="icon-user text-sm text-white"></div>
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)]">{user.name}</span>
            </div>
            
            <button onClick={logout} className="btn btn-secondary">
              <div className="icon-log-out text-lg"></div>
              Logout
            </button>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('DashboardHeader component error:', error);
    return null;
  }
}
