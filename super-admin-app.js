class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SuperAdminApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [activeSection, setActiveSection] = React.useState('dashboard');
    const [clinics, setClinics] = React.useState([]);
    const [therapists, setTherapists] = React.useState([]);
    const [patients, setPatients] = React.useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const currentUser = requireAuth();
      if (currentUser && currentUser.role !== 'super_admin') {
        window.location.href = 'index.html';
        return;
      }
      setUser(currentUser);
      loadData();
    }, []);

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check if database functions exist
        if (typeof window.trickleListObjects !== 'function') {
          console.warn('Database functions not available, using fallback data');
          setClinics([
            {
              objectId: 'clinic-001',
              objectData: { name: 'Sample Clinic', status: 'active' }
            }
          ]);
          setTherapists([
            {
              objectId: 'therapist-001', 
              objectData: { name: 'Dr. Sample', status: 'active' }
            }
          ]);
          setPatients([
            {
              objectId: 'patient-001',
              objectData: { name: 'Sample Patient', status: 'active' }
            }
          ]);
          return;
        }

        try {
          const [clinicsData, therapistsData, patientsData] = await Promise.all([
            window.trickleListObjects('clinic').catch(err => {
              console.warn('Clinic data fetch failed:', err);
              return { items: [] };
            }),
            window.trickleListObjects('therapist').catch(err => {
              console.warn('Therapist data fetch failed:', err);
              return { items: [] };
            }),
            window.trickleListObjects('patient').catch(err => {
              console.warn('Patient data fetch failed:', err);
              return { items: [] };
            })
          ]);
          
          setClinics(clinicsData && clinicsData.items && Array.isArray(clinicsData.items) ? clinicsData.items : []);
          setTherapists(therapistsData && therapistsData.items && Array.isArray(therapistsData.items) ? therapistsData.items : []);
          setPatients(patientsData && patientsData.items && Array.isArray(patientsData.items) ? patientsData.items : []);
        } catch (promiseError) {
          console.warn('Promise.all failed, using fallbacks:', promiseError);
          setClinics([]);
          setTherapists([]);
          setPatients([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setClinics([]);
        setTherapists([]);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    const handleCreateClinic = async (clinicData) => {
      try {
        const newClinic = await trickleCreateObject('clinic', {
          ...clinicData,
          status: 'active',
          adminId: `admin-${Date.now()}`
        });
        setClinics(prev => [newClinic, ...prev]);
      } catch (error) {
        console.error('Error creating clinic:', error);
        throw error;
      }
    };

    const handleDeleteClinic = async (clinicId) => {
      if (confirm('Are you sure you want to delete this clinic?')) {
        try {
          await trickleDeleteObject('clinic', clinicId);
          setClinics(prev => prev.filter(c => c.objectId !== clinicId));
        } catch (error) {
          console.error('Error deleting clinic:', error);
        }
      }
    };

    if (!user || loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--secondary-color)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen bg-[var(--secondary-color)]" data-name="super-admin-app" data-file="super-admin-app.js">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} userRole="super_admin" />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} title="Super Admin Dashboard" />
          
          <main className="flex-1 p-6">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Global Dashboard</h2>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="btn btn-primary"
                    >
                      <div className="icon-plus text-lg"></div>
                      Create New Clinic
                    </button>
                    <button className="btn btn-secondary">
                      <div className="icon-settings text-lg"></div>
                      System Config
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Clinics"
                    value={clinics.length.toString()}
                    change={`${clinics.filter(c => c.objectData.status === 'active').length} active`}
                    icon="building-2"
                    color="blue"
                  />
                  <StatCard
                    title="All Therapists"
                    value={therapists.length.toString()}
                    change={`${therapists.filter(t => t.objectData.status === 'active').length} active`}
                    icon="user-check"
                    color="green"
                  />
                  <StatCard
                    title="All Patients"
                    value={patients.length.toString()}
                    change={`${patients.filter(p => p.objectData.status === 'active').length} active`}
                    icon="users"
                    color="purple"
                  />
                  <StatCard
                    title="Global Revenue"
                    value="$124.5K"
                    change="+15% vs last month"
                    icon="dollar-sign"
                    color="green"
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">System Configuration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="icon-toggle-left text-lg text-blue-600"></div>
                          <span className="font-medium">Feature Toggles</span>
                        </div>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">Manage</button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="icon-shield text-lg text-green-600"></div>
                          <span className="font-medium">Security Settings</span>
                        </div>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">Configure</button>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div className="icon-database text-lg text-purple-600"></div>
                        <div>
                          <p className="font-medium">Automated Backups</p>
                          <p className="text-sm text-[var(--text-secondary)]">Last backup: 2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Financial & Analytics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Revenue Trends</span>
                        <span className="text-green-600 font-semibold">+15% ↗</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Compliance Reports</span>
                        <span className="text-blue-600 font-semibold">Generated</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Cross-Clinic Performance</span>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">View Report</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Subscription Management</span>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">Manage</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'clinics' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Clinic Management</h2>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <div className="icon-plus text-lg"></div>
                    Add New Clinic
                  </button>
                </div>

                <ClinicList 
                  clinics={clinics}
                  onEdit={(clinic) => console.log('Edit clinic:', clinic)}
                  onDelete={handleDeleteClinic}
                />
              </div>
            )}

            {activeSection === 'therapists' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Therapists</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">All Therapists</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {therapists.map((therapist) => (
                      <div key={therapist.objectId} className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div>
                          <p className="font-medium">{therapist.objectData.name}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{therapist.objectData.email}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{therapist.objectData.specialization}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {therapist.objectData.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-secondary)]">Total: {therapists.length} therapists</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'patients' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Patients</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">All Patients</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {patients.slice(0, 20).map((patient) => (
                      <div key={patient.objectId} className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div>
                          <p className="font-medium">{patient.objectData.name}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{patient.objectData.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {patient.objectData.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-secondary)]">Showing 20 of {patients.length} patients</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'sessions' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sessions</h2>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Today's Sessions</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium">Dr. Sarah Wilson</p>
                        <p className="text-sm text-[var(--text-secondary)]">8 sessions scheduled</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium">Dr. Michael Chen</p>
                        <p className="text-sm text-[var(--text-secondary)]">6 sessions scheduled</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Session Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Completed Today</span>
                        <span className="text-lg font-bold text-green-600">42</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Upcoming</span>
                        <span className="text-lg font-bold text-blue-600">28</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Cancelled</span>
                        <span className="text-lg font-bold text-red-600">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Reports</h2>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Revenue Trends</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">This Month</span>
                        <span className="text-2xl font-bold text-green-600">$124.5K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Last Month</span>
                        <span className="text-lg font-medium">$108.2K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Growth</span>
                        <span className="text-green-600 font-semibold">+15.1% ↗</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Compliance Reports</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">HIPAA Compliance</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✓ Passed</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Security Audit</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✓ Passed</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium">Data Backup</span>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">⚠ Review</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Cross-Clinic Performance</h3>
                    <div className="space-y-4">
                      {clinics.map((clinic, index) => (
                        <div key={clinic.objectId} className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)] truncate">{clinic.objectData.name}</span>
                          <span className="text-sm font-medium text-green-600">{85 + index * 3}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">System Configuration</h2>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Feature Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Telehealth Sessions</p>
                          <p className="text-sm text-[var(--text-secondary)]">Enable video consultations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">AI Analytics</p>
                          <p className="text-sm text-[var(--text-secondary)]">Advanced insights and predictions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Security Settings</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border rounded-lg hover:bg-[var(--secondary-color)] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="icon-shield text-blue-600"></div>
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-[var(--text-secondary)]">Configure 2FA settings</p>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border rounded-lg hover:bg-[var(--secondary-color)] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="icon-key text-green-600"></div>
                          <div>
                            <p className="font-medium">API Access Keys</p>
                            <p className="text-sm text-[var(--text-secondary)]">Manage integration keys</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Feature Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Telehealth Sessions</p>
                          <p className="text-sm text-[var(--text-secondary)]">Enable video consultations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">AI Analytics</p>
                          <p className="text-sm text-[var(--text-secondary)]">Advanced insights and predictions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Security Settings</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border rounded-lg hover:bg-[var(--secondary-color)] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="icon-shield text-blue-600"></div>
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-[var(--text-secondary)]">Configure 2FA settings</p>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border rounded-lg hover:bg-[var(--secondary-color)] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="icon-key text-green-600"></div>
                          <div>
                            <p className="font-medium">API Access Keys</p>
                            <p className="text-sm text-[var(--text-secondary)]">Manage integration keys</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        <CreateClinicModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateClinic}
        />
      </div>
    );
  } catch (error) {
    console.error('SuperAdminApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <SuperAdminApp />
  </ErrorBoundary>
);