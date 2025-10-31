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

function ClinicAdminApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [activeSection, setActiveSection] = React.useState('dashboard');
    const [clinicData, setClinicData] = React.useState(null);
    const [therapists, setTherapists] = React.useState([]);
    const [patients, setPatients] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [isHireTherapistModalOpen, setIsHireTherapistModalOpen] = React.useState(false);
    const [isEnrollPatientModalOpen, setIsEnrollPatientModalOpen] = React.useState(false);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = React.useState(false);
    const [isRemoveTherapistModalOpen, setIsRemoveTherapistModalOpen] = React.useState(false);
    const [selectedTherapist, setSelectedTherapist] = React.useState(null);

    React.useEffect(() => {
      const currentUser = requireAuth();
      if (currentUser && currentUser.role !== 'clinic_admin') {
        window.location.href = 'index.html';
        return;
      }
      setUser(currentUser);
      loadClinicData();
    }, []);

    const loadClinicData = async () => {
      try {
        setLoading(true);
        
        // Check if database functions exist
        if (typeof window.trickleListObjects !== 'function') {
          console.warn('Database functions not available, using fallback data');
          setTherapists([
            {
              objectId: 'therapist-001',
              objectData: { name: 'Dr. Sample Therapist', specialization: 'CBT', status: 'active' }
            }
          ]);
          setPatients([
            {
              objectId: 'patient-001', 
              objectData: { name: 'Sample Patient', status: 'active' }
            }
          ]);
          setLoading(false);
          return;
        }

        try {
          const [therapistsData, patientsData] = await Promise.all([
            window.trickleListObjects('therapist').catch(err => {
              console.warn('Therapist data fetch failed:', err);
              return { items: [] };
            }),
            window.trickleListObjects('patient').catch(err => {
              console.warn('Patient data fetch failed:', err);
              return { items: [] };
            })
          ]);
          
          if (therapistsData && therapistsData.items && Array.isArray(therapistsData.items)) {
            setTherapists(therapistsData.items.slice(0, 12));
          } else {
            setTherapists([]);
          }
          
          if (patientsData && patientsData.items && Array.isArray(patientsData.items)) {
            setPatients(patientsData.items.slice(0, 248));
          } else {
            setPatients([]);
          }
        } catch (promiseError) {
          console.warn('Database loading failed, using empty arrays:', promiseError);
          setTherapists([]);
          setPatients([]);
        }
      } catch (error) {
        console.error('Error loading clinic data:', error);
        setTherapists([]);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    const handleHireTherapist = async (therapistData) => {
      try {
        if (typeof window.trickleCreateObject === 'function') {
          const newTherapist = await window.trickleCreateObject('therapist', {
            ...therapistData,
            clinicId: 'clinic-001',
            status: 'active'
          });
          setTherapists(prev => [newTherapist, ...prev]);
        } else {
          // Fallback for demo
          const newTherapist = {
            objectId: `therapist-${Date.now()}`,
            objectType: 'therapist',
            objectData: {
              ...therapistData,
              clinicId: 'clinic-001',
              status: 'active'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setTherapists(prev => [newTherapist, ...prev]);
        }
      } catch (error) {
        console.error('Error hiring therapist:', error);
        throw error;
      }
    };

    const handleEnrollPatient = async (patientData) => {
      try {
        if (typeof window.trickleCreateObject === 'function') {
          const newPatient = await window.trickleCreateObject('patient', {
            ...patientData,
            clinicId: 'clinic-001',
            status: 'active'
          });
          setPatients(prev => [newPatient, ...prev]);
        } else {
          // Fallback for demo
          const newPatient = {
            objectId: `patient-${Date.now()}`,
            objectType: 'patient',
            objectData: {
              ...patientData,
              clinicId: 'clinic-001',
              status: 'active'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setPatients(prev => [newPatient, ...prev]);
        }
      } catch (error) {
        console.error('Error enrolling patient:', error);
        throw error;
      }
    };

    const handleRemoveTherapist = async (therapistId) => {
      try {
        if (typeof window.trickleDeleteObject === 'function') {
          await window.trickleDeleteObject('therapist', therapistId);
        }
        setTherapists(prev => prev.filter(t => t.objectId !== therapistId));
        setIsRemoveTherapistModalOpen(false);
        setSelectedTherapist(null);
      } catch (error) {
        console.error('Error removing therapist:', error);
        alert('Failed to remove therapist. Please try again.');
      }
    };

    const openRemoveTherapistModal = (therapist) => {
      setSelectedTherapist(therapist);
      setIsRemoveTherapistModalOpen(true);
    };

    const handleSendAnnouncement = async (announcementData) => {
      try {
        console.log('Announcement sent:', announcementData);
        // In a real app, this would send to a messaging service
      } catch (error) {
        console.error('Error sending announcement:', error);
        throw error;
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
      <div className="flex min-h-screen bg-[var(--secondary-color)]" data-name="clinic-admin-app" data-file="clinic-admin-app.js">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} userRole="clinic_admin" />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} title="Clinic Admin Dashboard" />
          
          <main className="flex-1 p-6">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Clinic Management Dashboard</h2>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsHireTherapistModalOpen(true)}
                      className="btn btn-primary"
                    >
                      <div className="icon-user-plus text-lg"></div>
                      Hire Therapist
                    </button>
                    <button 
                      onClick={() => setIsAnnouncementModalOpen(true)}
                      className="btn btn-secondary"
                    >
                      <div className="icon-megaphone text-lg"></div>
                      Send Announcement
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Clinic Therapists"
                    value={therapists.length.toString()}
                    change={`${therapists.filter(t => t.objectData.status === 'active').length} active`}
                    icon="user-check"
                    color="blue"
                  />
                  <StatCard
                    title="Clinic Patients"
                    value={patients.length.toString()}
                    change={`${patients.filter(p => p.objectData.status === 'active').length} active`}
                    icon="users"
                    color="green"
                  />
                  <StatCard
                    title="Today's Sessions"
                    value="32"
                    change="8 remaining"
                    icon="calendar"
                    color="purple"
                  />
                  <StatCard
                    title="Clinic Revenue"
                    value="$24,500"
                    change="+12% vs last month"
                    icon="dollar-sign"
                    color="green"
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Revenue & Invoicing</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div>
                          <p className="font-medium">Session Invoicing</p>
                          <p className="text-sm text-[var(--text-secondary)]">124 invoices pending</p>
                        </div>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">Process</button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div>
                          <p className="font-medium">Financial Analytics</p>
                          <p className="text-sm text-[var(--text-secondary)]">Clinic performance metrics</p>
                        </div>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">View Report</button>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Patient Outcome Analytics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Treatment Success Rate</span>
                        <span className="text-green-600 font-semibold">87%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Therapist Performance</span>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">View Details</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Operational Efficiency</span>
                        <span className="text-blue-600 font-semibold">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'therapists' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Therapist Management</h2>
                  <button 
                    onClick={() => setIsHireTherapistModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <div className="icon-user-plus text-lg"></div>
                    Hire Therapist
                  </button>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Clinic Therapists</h3>
                  <div className="space-y-3">
                    {therapists.map((therapist) => (
                      <div key={therapist.objectId} className="flex items-center justify-between p-4 bg-[var(--secondary-color)] rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-[var(--text-primary)]">{therapist.objectData.name}</h4>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              {therapist.objectData.status}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{therapist.objectData.email}</p>
                          <p className="text-sm text-[var(--text-secondary)]">Specialization: {therapist.objectData.specialization}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 text-[var(--primary-color)] hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit therapist"
                          >
                            <div className="icon-edit text-lg"></div>
                          </button>
                          <button 
                            className="p-2 text-[var(--text-secondary)] hover:bg-gray-100 rounded-lg transition-colors"
                            title="View schedule"
                          >
                            <div className="icon-calendar text-lg"></div>
                          </button>
                          <button 
                            onClick={() => openRemoveTherapistModal(therapist)}
                            className="p-2 text-[var(--danger-color)] hover:bg-red-100 rounded-lg transition-colors"
                            title="Remove therapist"
                          >
                            <div className="icon-trash-2 text-lg"></div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'patients' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Patient Management</h2>
                  <button 
                    onClick={() => setIsEnrollPatientModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <div className="icon-user-plus text-lg"></div>
                    Enroll Patient
                  </button>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Clinic Patients</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {patients.slice(0, 20).map((patient) => (
                      <div key={patient.objectId} className="flex items-center justify-between p-4 bg-[var(--secondary-color)] rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-[var(--text-primary)]">{patient.objectData.name}</h4>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {patient.objectData.status}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{patient.objectData.email}</p>
                          <p className="text-sm text-[var(--text-secondary)]">Therapist ID: {patient.objectData.therapistId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-[var(--primary-color)] hover:bg-blue-100 rounded-lg">
                            <div className="icon-eye text-lg"></div>
                          </button>
                          <button className="p-2 text-[var(--text-secondary)] hover:bg-gray-100 rounded-lg">
                            <div className="icon-file-text text-lg"></div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-secondary)]">Showing 20 of {patients.length} patients</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'schedule' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Schedule</h2>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Today's Schedule</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Dr. Sarah Wilson</p>
                          <p className="text-sm text-[var(--text-secondary)]">9:00 AM - 5:00 PM</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">8 sessions</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Dr. Michael Chen</p>
                          <p className="text-sm text-[var(--text-secondary)]">10:00 AM - 6:00 PM</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">6 sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Resource Allocation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Room 1 - Therapy</span>
                        <span className="text-sm font-medium text-green-600">Available</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Room 2 - Group Session</span>
                        <span className="text-sm font-medium text-red-600">Occupied</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Room 3 - Assessment</span>
                        <span className="text-sm font-medium text-green-600">Available</span>
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
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Treatment Success Rate</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
                      <div className="text-sm text-[var(--text-secondary)]">Patients showing improvement</div>
                      <div className="text-xs text-green-600 mt-1">+3% from last month</div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Average Session Rating</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">4.8</div>
                      <div className="text-sm text-[var(--text-secondary)]">Patient satisfaction score</div>
                      <div className="text-xs text-blue-600 mt-1">↗ Excellent rating</div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Operational Efficiency</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">92%</div>
                      <div className="text-sm text-[var(--text-secondary)]">Resource utilization</div>
                      <div className="text-xs text-purple-600 mt-1">Optimal performance</div>
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
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Clinic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Clinic Name</label>
                        <input type="text" defaultValue="MindWell Therapy Center" className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Contact Email</label>
                        <input type="email" defaultValue="clinic@uniquorn.com" className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Email Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">SMS Reminders</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        <HireTherapistModal
          isOpen={isHireTherapistModalOpen}
          onClose={() => setIsHireTherapistModalOpen(false)}
          onSubmit={handleHireTherapist}
        />

        <EnrollPatientModal
          isOpen={isEnrollPatientModalOpen}
          onClose={() => setIsEnrollPatientModalOpen(false)}
          onSubmit={handleEnrollPatient}
          therapists={therapists}
        />

        <SendAnnouncementModal
          isOpen={isAnnouncementModalOpen}
          onClose={() => setIsAnnouncementModalOpen(false)}
          onSubmit={handleSendAnnouncement}
        />

        <RemoveTherapistModal
          isOpen={isRemoveTherapistModalOpen}
          onClose={() => setIsRemoveTherapistModalOpen(false)}
          onConfirm={handleRemoveTherapist}
          therapist={selectedTherapist}
        />
      </div>
    );
  } catch (error) {
    console.error('ClinicAdminApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ClinicAdminApp />
  </ErrorBoundary>
);