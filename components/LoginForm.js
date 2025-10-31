function LoginForm({ onLogin }) {
  try {
    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
      role: 'patient'
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        // Simulate login process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          id: Date.now().toString(),
          email: formData.email,
          role: formData.role,
          name: formData.email.split('@')[0],
          loginTime: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('therapyConnect_user', JSON.stringify(userData));
        
        onLogin(userData);
      } catch (error) {
        console.error('Login error:', error);
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
      <div className="card" data-name="login-form" data-file="components/LoginForm.js">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sign In</h2>
          <p className="text-[var(--text-secondary)] mt-2">Access your therapy management dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
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
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
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

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
            >
              <option value="patient">Patient</option>
              <option value="therapist">Therapist</option>
              <option value="clinic_admin">Clinic Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing In...
              </>
            ) : (
              <>
                <div className="icon-log-in text-lg"></div>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Demo System - Use any email and password to login
        </div>
      </div>
    );
  } catch (error) {
    console.error('LoginForm component error:', error);
    return null;
  }
}