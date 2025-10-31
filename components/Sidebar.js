function Sidebar({ activeSection, onSectionChange, userRole }) {
  try {
    const menuItems = {
      super_admin: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'clinics', label: 'Clinics', icon: 'building-2' },
        { id: 'therapists', label: 'Therapists', icon: 'user-check' },
        { id: 'patients', label: 'Patients', icon: 'users' },
        { id: 'sessions', label: 'Sessions', icon: 'calendar' },
        { id: 'reports', label: 'Reports', icon: 'chart-bar' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ],
      clinic_admin: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'therapists', label: 'Therapists', icon: 'user-check' },
        { id: 'patients', label: 'Patients', icon: 'users' },
        { id: 'schedule', label: 'Schedule', icon: 'calendar' },
        { id: 'reports', label: 'Reports', icon: 'chart-bar' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ],
      therapist: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'patients', label: 'My Patients', icon: 'users' },
        { id: 'schedule', label: 'Schedule', icon: 'calendar' },
        { id: 'sessions', label: 'Sessions', icon: 'file-text' },
        { id: 'exercises', label: 'Exercises', icon: 'activity' },
        { id: 'messages', label: 'Messages', icon: 'message-circle' }
      ],
      patient: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'appointments', label: 'Appointments', icon: 'calendar' },
        { id: 'progress', label: 'My Progress', icon: 'trending-up' },
        { id: 'exercises', label: 'My Exercises', icon: 'activity' },
        { id: 'messages', label: 'Messages', icon: 'message-circle' }
      ]
    };

    const currentMenuItems = menuItems[userRole] || [];

    return (
      <aside className="sidebar w-64" data-name="sidebar" data-file="components/Sidebar.js">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center overflow-hidden">
              <img src="https://app.trickle.so/storage/public/images/usr_1498ae64b0000001/30e23543-8bb9-4613-9046-e15afdd88d21.jpeg" alt="UniQuorn Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">UniQuorn</span>
          </div>

        <nav className="space-y-2">
          {currentMenuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`sidebar-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
                activeSection === item.id
                  ? 'sidebar-item active bg-gradient-to-r from-[var(--primary-color)] to-purple-600 text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--secondary-color)] hover:shadow-md'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`icon-${item.icon} text-lg transition-transform duration-300 hover:scale-110`}></div>
              {item.label}
            </button>
          ))}
        </nav>
        </div>
      </aside>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return null;
  }
}
