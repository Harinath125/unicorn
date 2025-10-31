function RoleCard({ title, description, icon, color, features }) {
  try {
    const colorClasses = {
      purple: 'bg-purple-100 text-purple-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      pink: 'bg-pink-100 text-pink-600'
    };

    return (
      <div className="card hover:shadow-lg transition-shadow duration-300" data-name="role-card" data-file="components/RoleCard.js">
        <div className="text-center mb-4">
          <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-4`}>
            <div className={`icon-${icon} text-2xl`}></div>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
        </div>

        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <div className="icon-check text-sm text-[var(--accent-color)]"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('RoleCard component error:', error);
    return null;
  }
}