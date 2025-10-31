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

function TherapistApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [activeSection, setActiveSection] = React.useState('dashboard');
    const [patients, setPatients] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [isSOAPModalOpen, setIsSOAPModalOpen] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = React.useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
    const [isAssignExerciseModalOpen, setIsAssignExerciseModalOpen] = React.useState(false);

    React.useEffect(() => {
      const currentUser = requireAuth();
      if (currentUser && currentUser.role !== 'therapist') {
        window.location.href = 'index.html';
        return;
      }
      setUser(currentUser);
      loadPatientData();
    }, []);

    const loadPatientData = async () => {
      try {
        setLoading(true);
        
        // Check if database functions exist
        if (typeof window.trickleListObjects !== 'function') {
          console.warn('Database functions not available, using fallback data');
          setPatients([
            {
              objectId: 'patient-001',
              objectType: 'patient',
              objectData: {
                name: 'John Smith',
                email: 'john.smith@email.com',
                status: 'active'
              }
            },
            {
              objectId: 'patient-002', 
              objectType: 'patient',
              objectData: {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@email.com',
                status: 'active'
              }
            }
          ]);
          return;
        }

        try {
          const patientsData = await window.trickleListObjects('patient');
          if (patientsData && patientsData.items && Array.isArray(patientsData.items)) {
            setPatients(patientsData.items.slice(0, 28));
          } else {
            console.warn('Invalid patient data format, using fallback');
            setPatients([]);
          }
        } catch (fetchError) {
          console.warn('Database fetch failed, using fallback data:', fetchError);
          setPatients([
            {
              objectId: 'patient-fallback-001',
              objectType: 'patient', 
              objectData: {
                name: 'Sample Patient',
                email: 'patient@example.com',
                status: 'active'
              }
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading patient data:', error);
        // Set fallback data on error
        setPatients([
          {
            objectId: 'patient-fallback-001',
            objectType: 'patient', 
            objectData: {
              name: 'Sample Patient',
              email: 'patient@example.com',
              status: 'active'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    const handleCreateSOAP = async (soapData) => {
      try {
        console.log('SOAP note created:', soapData);
        // In a real app, this would save to the database
      } catch (error) {
        console.error('Error creating SOAP note:', error);
        throw error;
      }
    };

    const handleSendMessage = async (messageData) => {
      try {
        console.log('Message sent:', messageData);
        // In a real app, this would send to a messaging service
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    };

    const handleAssignExercise = async (exerciseData) => {
      try {
        console.log('Exercise assigned:', exerciseData);
        // In a real app, this would save to the database and notify the patient
      } catch (error) {
        console.error('Error assigning exercise:', error);
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
      <div className="flex min-h-screen bg-[var(--secondary-color)]" data-name="therapist-app" data-file="therapist-app.js">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} userRole="therapist" />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} title="Therapist Dashboard" />
          
          <main className="flex-1 p-6">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Patient Care Dashboard</h2>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsSOAPModalOpen(true)}
                      className="btn btn-primary"
                    >
                      <div className="icon-file-plus text-lg"></div>
                      New SOAP Note
                    </button>
                    <button 
                      onClick={() => setIsAssignExerciseModalOpen(true)}
                      className="btn btn-secondary"
                    >
                      <div className="icon-activity text-lg"></div>
                      Assign Exercise
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Assigned Patients"
                    value={patients.length.toString()}
                    change={`${patients.filter(p => p.objectData.status === 'active').length} active`}
                    icon="users"
                    color="blue"
                  />
                  <StatCard
                    title="Today's Sessions"
                    value="6"
                    change="2 documented"
                    icon="calendar"
                    color="green"
                  />
                  <StatCard
                    title="Exercise Programs"
                    value="15"
                    change="active programs"
                    icon="activity"
                    color="purple"
                  />
                  <StatCard
                    title="Adherence Rate"
                    value="84%"
                    change="patient compliance"
                    icon="trending-up"
                    color="green"
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">SOAP Documentation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div>
                          <p className="font-medium">Sarah Johnson - Session</p>
                          <p className="text-sm text-[var(--text-secondary)]">SOAP note pending documentation</p>
                        </div>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">Document</button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div>
                          <p className="font-medium">Mike Chen - Progress Review</p>
                          <p className="text-sm text-[var(--text-secondary)]">Treatment plan modification needed</p>
                        </div>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">Update Plan</button>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Progress Analytics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Treatment Adherence</span>
                        <span className="text-green-600 font-semibold">84%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Exercise Completion</span>
                        <span className="text-blue-600 font-semibold">78%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Outcome Measurements</span>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">View Trends</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'patients' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Patient Management</h2>
                  <button 
                    onClick={() => setIsSOAPModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <div className="icon-user-plus text-lg"></div>
                    Add Patient Note
                  </button>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">My Patients</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {patients.map((patient) => (
                      <div key={patient.objectId} className="flex items-center justify-between p-4 bg-[var(--secondary-color)] rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-[var(--text-primary)]">{patient.objectData.name}</h4>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              {patient.objectData.status}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{patient.objectData.email}</p>
                          <p className="text-sm text-[var(--text-secondary)]">Last session: 3 days ago</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-[var(--primary-color)] hover:bg-blue-100 rounded-lg" title="View Details">
                            <div className="icon-eye text-lg"></div>
                          </button>
                          <button className="p-2 text-[var(--text-secondary)] hover:bg-gray-100 rounded-lg" title="SOAP Notes">
                            <div className="icon-file-text text-lg"></div>
                          </button>
                        </div>
                      </div>
                    ))}
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
                          <p className="font-medium">John Smith</p>
                          <p className="text-sm text-[var(--text-secondary)]">9:00 AM - Individual Session</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Confirmed</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Emily Johnson</p>
                          <p className="text-sm text-[var(--text-secondary)]">2:00 PM - Follow-up</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Upcoming This Week</h3>
                    <div className="space-y-3">
                      <div className="text-sm text-[var(--text-secondary)]">
                        <p>Tomorrow: 5 sessions scheduled</p>
                        <p>Thursday: 7 sessions scheduled</p>
                        <p>Friday: 4 sessions scheduled</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'sessions' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sessions</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent SOAP Notes</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">John Smith - Oct 15, 2025</h4>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Completed</span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">Subjective: Patient reports improved mood and sleep patterns...</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Emily Johnson - Oct 14, 2025</h4>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Draft</span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">Subjective: Patient experiencing increased anxiety about work...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'exercises' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Exercise Assignment</h2>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Exercise Library</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium">Breathing Exercises</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Deep breathing techniques for anxiety management</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium">Cognitive Restructuring</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Thought challenging worksheets</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Active Programs</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-[var(--secondary-color)] rounded-lg">
                        <p className="font-medium">John Smith - Anxiety Management</p>
                        <p className="text-sm text-[var(--text-secondary)]">Progress: 75% completed</p>
                      </div>
                      <div className="p-3 bg-[var(--secondary-color)] rounded-lg">
                        <p className="font-medium">Emily Johnson - Sleep Hygiene</p>
                        <p className="text-sm text-[var(--text-secondary)]">Progress: 50% completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Messages</h2>
                  <button 
                    onClick={() => setIsMessageModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <div className="icon-message-circle text-lg"></div>
                    New Message
                  </button>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Patient Conversations</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {patients.slice(0, 5).map((patient) => (
                        <button 
                          key={patient.objectId}
                          onClick={() => setSelectedPatient(patient)}
                          className="w-full p-3 border-l-4 border-blue-400 bg-blue-50 rounded hover:bg-blue-100 transition-colors text-left"
                        >
                          <p className="font-medium text-sm">{patient.objectData.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">Click to start conversation</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    {selectedPatient ? (
                      <ChatWindow 
                        patient={selectedPatient}
                        onSendMessage={handleSendMessage}
                      />
                    ) : (
                      <div className="card">
                        <div className="text-center py-12">
                          <div className="icon-message-circle text-4xl text-[var(--text-secondary)] mb-4"></div>
                          <p className="text-[var(--text-secondary)]">Select a patient to start messaging</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        <SOAPNoteModal
          isOpen={isSOAPModalOpen}
          onClose={() => setIsSOAPModalOpen(false)}
          onSubmit={handleCreateSOAP}
          patientName={selectedPatient?.objectData?.name || ''}
        />

        <NewMessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          onSubmit={handleSendMessage}
        />

        <AssignExerciseModal
          isOpen={isAssignExerciseModalOpen}
          onClose={() => setIsAssignExerciseModalOpen(false)}
          onSubmit={handleAssignExercise}
          patients={patients}
        />
      </div>
    );
  } catch (error) {
    console.error('TherapistApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <TherapistApp />
  </ErrorBoundary>
);