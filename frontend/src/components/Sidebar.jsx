import { NavLink } from "react-router-dom";
import { navigationItems } from "../services/navigation";

function Sidebar() {
    return (
        <aside className = "app-sidebar">
            <nav className = "sidebar-nav" aria-label = "Main navigation">
                {
                    navigationItems.map(
                        (item) => (
                            <NavLink
                              key = {item.path} 
                              to = {item.path}
                              className = {
                                ({ isActive }) => isActive ? "nav-link active" : "nav-link"
                              }
                            >
                                { item.label }
                            </NavLink>
                        )
                    )
                }
            </nav>
        </aside>
    );
}

export default Sidebar;