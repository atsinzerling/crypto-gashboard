import { Outlet, Link } from "react-router-dom";
import './Layout.css';

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link className="button"  to="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link className="button"  to="/manage">Manage Trackings</Link>
                    </li>
                    <li>
                        <Link className="button" to="/test">Test</Link>
                    </li>
                    <li className="login">
                        <Link className="button"  to="/login">Log in</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;