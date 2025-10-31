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
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        // Redirect to appropriate dashboard if already logged in
        switch(currentUser.role) {
          case 'super_admin':
            window.location.href = 'super-admin.html';
            break;
          case 'clinic_admin':
            window.location.href = 'clinic-admin.html';
            break;
          case 'therapist':
            window.location.href = 'therapist.html';
            break;
          case 'patient':
            window.location.href = 'patient.html';
            break;
        }
      }
      setUser(currentUser);
      setLoading(false);
    }, []);

    const handleLogin = (userData) => {
      setUser(userData);
      // Redirect based on role
      switch(userData.role) {
        case 'super_admin':
          window.location.href = 'super-admin.html';
          break;
        case 'clinic_admin':
          window.location.href = 'clinic-admin.html';
          break;
        case 'therapist':
          window.location.href = 'therapist.html';
          break;
        case 'patient':
          window.location.href = 'patient.html';
          break;
        default:
          break;
      }
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen relative overflow-hidden" data-name="app" data-file="app.js">
        {/* Background Elements */}
        <div className="absolute inset-0 hero-bg-animation"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Animated Pattern Overlay */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            animation: 'float 10s ease-in-out infinite'
          }}
        ></div>
        
        {/* Hero Section */}
        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Hero Content */}
          <div className="flex-1 lg:w-3/5 flex flex-col justify-center px-8 lg:px-16">
            <div className="max-w-2xl">
              {/* Brand Header */}
              <div className="flex items-center gap-4 mb-12 animate-entrance">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center border border-white/30 animate-pulse-glow overflow-hidden">
                  <img src="https://app.trickle.so/storage/public/images/usr_1498ae64b0000001/30e23543-8bb9-4613-9046-e15afdd88d21.jpeg" alt="UniQuorn Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white animate-fade-in">UniQuorn</h1>
                  <p className="text-lg text-blue-100 font-medium animate-fade-in" style={{animationDelay: '0.2s'}}>Professional Mental Health Management</p>
                </div>
              </div>
              
              {/* Main Headline */}
              <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Transform Your<br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Mental Health
                </span><br />
                Practice
              </h2>
              
              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed">
                Streamline operations, enhance patient care, and grow your practice with our comprehensive HIPAA-compliant management platform trusted by thousands of professionals.
              </p>

              {/* Key Features Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <FeatureCard
                  icon="users"
                  title="Multi-Role Dashboards"
                  description="Specialized interfaces for administrators, therapists, and patients with role-based permissions"
                />
                <FeatureCard
                  icon="calendar"
                  title="Smart Scheduling"
                  description="AI-powered appointment management with automated reminders and conflict resolution"
                />
                <FeatureCard
                  icon="chart-bar"
                  title="Advanced Analytics"
                  description="Real-time insights into patient progress, treatment outcomes, and practice performance"
                />
                <FeatureCard
                  icon="shield-check"
                  title="HIPAA Compliant"
                  description="Bank-level security with end-to-end encryption and comprehensive audit trails"
                />
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="icon-check-circle text-lg text-green-400"></div>
                  <span className="text-sm font-medium">SOC 2 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="icon-shield text-lg text-blue-400"></div>
                  <span className="text-sm font-medium">HIPAA Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="icon-award text-lg text-yellow-400"></div>
                  <span className="text-sm font-medium">Industry Leader</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication */}
          <div className="lg:w-2/5 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-md">
              <AuthForm onLogin={handleLogin} />
            </div>
          </div>
        </div>

        {/* Mobile Hero Section */}
        <div className="lg:hidden relative z-10 px-8 py-16 text-center">
          <div className="w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center border border-white/30 mx-auto mb-6 overflow-hidden">
            <img src="https://app.trickle.so/storage/public/images/usr_1498ae64b0000001/30e23543-8bb9-4613-9046-e15afdd88d21.jpeg" alt="UniQuorn Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">UniQuorn</h1>
          <p className="text-blue-100 mb-8">Transform Your Mental Health Practice</p>
          <div className="max-w-sm mx-auto">
            <AuthForm onLogin={handleLogin} />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-white/60 text-sm">
            © 2025 UniQuorn. All rights reserved. | Trusted by 10,000+ healthcare professionals
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);