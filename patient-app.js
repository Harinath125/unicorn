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

function PatientApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [activeSection, setActiveSection] = React.useState('dashboard');
    const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
    const [isExerciseModalOpen, setIsExerciseModalOpen] = React.useState(false);
    const [selectedExercise, setSelectedExercise] = React.useState(null);

  React.useEffect(() => {
    try {
      const currentUser = requireAuth();
      if (currentUser && currentUser.role !== 'patient') {
        window.location.href = 'index.html';
        return;
      }
      setUser(currentUser);
    } catch (authError) {
      console.error('Authentication error:', authError);
      window.location.href = 'index.html';
    }
  }, []);

    const handleBookAppointment = async (appointmentData) => {
      try {
        console.log('Appointment booked:', appointmentData);
        // In a real app, this would save to the database
      } catch (error) {
        console.error('Error booking appointment:', error);
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

    const handleStartExercise = (exercise) => {
      setSelectedExercise(exercise);
      setIsExerciseModalOpen(true);
    };

    const handleCompleteExercise = (exercise) => {
      console.log('Exercise completed:', exercise);
      // In a real app, this would update progress tracking
    };

    const exercises = [
      { 
        id: 1, 
        name: 'Deep Breathing Exercise', 
        description: 'Practice diaphragmatic breathing to reduce anxiety', 
        duration: 15 
      },
      { 
        id: 2, 
        name: 'Mindfulness Meditation', 
        description: 'Guided meditation for stress relief', 
        duration: 10 
      }
    ];

    if (!user) {
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
      <div className="flex min-h-screen bg-[var(--secondary-color)]" data-name="patient-app" data-file="patient-app.js">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} userRole="patient" />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} title="Patient Portal" />
          
          <main className="flex-1 p-6">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Next Appointment"
                    value="Oct 18"
                    change="2 days away"
                    icon="calendar"
                    color="blue"
                  />
                  <StatCard
                    title="Total Sessions"
                    value="24"
                    change="this year"
                    icon="activity"
                    color="green"
                  />
                  <StatCard
                    title="Progress Score"
                    value="82%"
                    change="+5% this month"
                    icon="trending-up"
                    color="purple"
                  />
                  <StatCard
                    title="Therapist Rating"
                    value="4.9"
                    change="your feedback"
                    icon="star"
                    color="yellow"
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Upcoming Appointments</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div>
                          <p className="font-medium">Dr. Sarah Wilson</p>
                          <p className="text-sm text-[var(--text-secondary)]">Oct 18, 2025 at 2:00 PM</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Confirmed</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[var(--secondary-color)] rounded-lg">
                        <div>
                          <p className="font-medium">Dr. Michael Chen</p>
                          <p className="text-sm text-[var(--text-secondary)]">Oct 25, 2025 at 10:00 AM</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                      <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="text-sm text-[var(--primary-color)] hover:underline"
                      >
                        Book New Appointment
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Treatment Progress</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Anxiety Management</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-[var(--accent-color)]"></div>
                          </div>
                          <span className="text-sm font-medium">80%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Sleep Quality</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-3/5 h-full bg-[var(--accent-color)]"></div>
                          </div>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Exercise Completion</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-[var(--accent-color)]"></div>
                          </div>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appointments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Appointment Booking</h2>
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <div className="icon-plus text-lg"></div>
                    Book Appointment
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Upcoming Appointments</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Dr. Sarah Wilson</p>
                            <p className="text-sm text-[var(--text-secondary)]">Individual Therapy Session</p>
                            <p className="text-xs text-blue-600 font-medium">Oct 18, 2025 at 2:00 PM</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Confirmed</span>
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Dr. Michael Chen</p>
                            <p className="text-sm text-[var(--text-secondary)]">Follow-up Session</p>
                            <p className="text-xs text-yellow-600 font-medium">Oct 25, 2025 at 10:00 AM</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Available Time Slots</h3>
                    <div className="space-y-2">
                      <button className="w-full p-3 text-left border rounded-lg hover:bg-[var(--secondary-color)]">
                        <p className="font-medium">Tomorrow - Oct 17</p>
                        <p className="text-sm text-[var(--text-secondary)]">10:00 AM, 2:00 PM available</p>
                      </button>
                      <button className="w-full p-3 text-left border rounded-lg hover:bg-[var(--secondary-color)]">
                        <p className="font-medium">Oct 19 - Friday</p>
                        <p className="text-sm text-[var(--text-secondary)]">9:00 AM, 1:00 PM, 4:00 PM available</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'progress' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">My Progress</h2>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Overall Progress</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">82%</div>
                      <div className="text-sm text-[var(--text-secondary)]">Treatment completion</div>
                      <div className="text-xs text-purple-600 mt-1">+5% this month</div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Sessions Completed</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">24</div>
                      <div className="text-sm text-[var(--text-secondary)]">This year</div>
                      <div className="text-xs text-green-600 mt-1">Goal: 30 sessions</div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Goal Achievement</h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">87%</div>
                      <div className="text-sm text-[var(--text-secondary)]">Goals met</div>
                      <div className="text-xs text-blue-600 mt-1">Excellent progress</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Treatment Goals & Milestones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Reduce Anxiety Levels</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-4/5 h-full bg-[var(--accent-color)]"></div>
                        </div>
                        <span className="text-sm font-medium">80%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Improve Sleep Quality</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-3/5 h-full bg-[var(--accent-color)]"></div>
                        </div>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Develop Coping Strategies</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-5/6 h-full bg-[var(--accent-color)]"></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'exercises' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">My Exercises</h2>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Today's Exercises</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Deep Breathing Exercise</h4>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">15 min</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">Practice diaphragmatic breathing to reduce anxiety</p>
                        <button 
                          onClick={() => handleStartExercise(exercises[0])}
                          className="btn btn-primary text-sm"
                        >
                          <div className="icon-play text-sm"></div>
                          Start Exercise
                        </button>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Mindfulness Meditation</h4>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">10 min</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">Guided meditation for stress relief</p>
                        <button className="btn btn-secondary text-sm">
                          <div className="icon-check text-sm"></div>
                          Completed
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Exercise Tracking</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">This Week</span>
                        <span className="text-lg font-bold text-green-600">12/15</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Completion Rate</span>
                        <span className="text-lg font-bold text-blue-600">80%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Streak</span>
                        <span className="text-lg font-bold text-purple-600">5 days</span>
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

                <div className="grid lg:grid-cols-4 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">My Therapist</h3>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <div className="icon-user text-2xl text-blue-600"></div>
                      </div>
                      <p className="font-medium text-[var(--text-primary)]">Dr. Sarah Wilson</p>
                      <p className="text-sm text-[var(--text-secondary)]">Licensed Clinical Psychologist</p>
                      <p className="text-xs text-green-600 mt-2">● Online now</p>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <PatientChatWindow 
                      therapistName="Dr. Sarah Wilson"
                      onSendMessage={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        <BookAppointmentModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookAppointment}
        />

        <NewMessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          onSubmit={handleSendMessage}
        />

        <ExerciseModal
          isOpen={isExerciseModalOpen}
          onClose={() => setIsExerciseModalOpen(false)}
          exercise={selectedExercise}
          onComplete={handleCompleteExercise}
        />
      </div>
    );
  } catch (error) {
    console.error('PatientApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <PatientApp />
  </ErrorBoundary>
);
