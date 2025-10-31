function StatCard({ title, value, change, icon, color }) {
  try {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    };

    return (
      <div className="stat-card" data-name="stat-card" data-file="components/StatCard.js">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <div className={`icon-${icon} text-xl`}></div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{change}</p>
          </div>
        </div>
        <h3 className="font-medium text-[var(--text-primary)]">{title}</h3>
      </div>
    );
  } catch (error) {
    console.error('StatCard component error:', error);
    return null;
  }
}