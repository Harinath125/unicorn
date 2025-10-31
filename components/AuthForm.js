function AuthForm({ onLogin }) {
  try {
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'patient',
      fullName: ''
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        // Simulate authentication process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const userData = {
          id: Date.now().toString(),
          email: formData.email,
          role: formData.role,
          name: formData.fullName || formData.email.split('@')[0],
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('uniquorn_user', JSON.stringify(userData));
        onLogin(userData);
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    return (
      <div className="auth-card" data-name="auth-form" data-file="components/AuthForm.js">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img src="https://app.trickle.so/storage/public/images/usr_1498ae64b0000001/30e23543-8bb9-4613-9046-e15afdd88d21.jpeg" alt="UniQuorn Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {isSignUp ? 'Join UniQuorn' : 'Welcome Back'}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg">
            {isSignUp ? 'Join 10,000+ healthcare professionals transforming patient care' : 'Access your personalized dashboard and continue your journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
                placeholder="Enter your full name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Confirm your password"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Select Your Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
            >
              <option value="patient">Patient - Personal health portal and treatment engagement</option>
              <option value="therapist">Therapist - Patient care and clinical documentation</option>
              <option value="clinic_admin">Clinic Admin - Clinic-level management and operations</option>
              <option value="super_admin">Super Admin - System-wide administrative control</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              <>
                <div className="icon-log-in text-xl"></div>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[var(--text-secondary)]">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 font-semibold text-[var(--primary-color)] hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-[var(--text-primary)] mb-3 text-sm">Demo Accounts</h4>
          <div className="grid grid-cols-1 gap-2 text-xs text-[var(--text-secondary)]">
            <div className="flex justify-between items-center">
              <span className="font-medium">Super Admin:</span>
              <button 
                type="button"
                onClick={() => setFormData({...formData, email: 'admin@uniquorn.com', password: 'admin123', role: 'super_admin'})}
                className="text-[var(--primary-color)] hover:underline"
              >
                admin@uniquorn.com
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Clinic Admin:</span>
              <button 
                type="button"
                onClick={() => setFormData({...formData, email: 'clinic@uniquorn.com', password: 'clinic123', role: 'clinic_admin'})}
                className="text-[var(--primary-color)] hover:underline"
              >
                clinic@uniquorn.com
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Therapist:</span>
              <button 
                type="button"
                onClick={() => setFormData({...formData, email: 'therapist@uniquorn.com', password: 'therapist123', role: 'therapist'})}
                className="text-[var(--primary-color)] hover:underline"
              >
                therapist@uniquorn.com
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Patient:</span>
              <button 
                type="button"
                onClick={() => setFormData({...formData, email: 'patient@uniquorn.com', password: 'patient123', role: 'patient'})}
                className="text-[var(--primary-color)] hover:underline"
              >
                patient@uniquorn.com
              </button>
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-3 text-center">
            Click any email to auto-fill the form, or use any custom credentials
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AuthForm component error:', error);
    return null;
  }
}