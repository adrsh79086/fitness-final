
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <h2 className="navbar-logo">FitTrack</h2>

      <div className="navbar-right">
        <span>{user.name || 'User'}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;