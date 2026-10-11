
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Main Menu</h3>

      <NavLink to="/dashboard" className="sidebar-link">
        Dashboard
      </NavLink>

      <NavLink to="/exercises" className="sidebar-link">
        Exercises
      </NavLink>

      <NavLink to="/workouts" className="sidebar-link">
        Workouts
      </NavLink>
    </aside>
  );
}

export default Sidebar;
