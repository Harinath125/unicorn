// Authentication utilities
function getCurrentUser() {
  try {
    const userData = localStorage.getItem('uniquorn_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

function logout() {
  try {
    localStorage.removeItem('uniquorn_user');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

function hasRole(requiredRole) {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
}

function hasAnyRole(requiredRoles) {
  const user = getCurrentUser();
  return user && requiredRoles.includes(user.role);
}