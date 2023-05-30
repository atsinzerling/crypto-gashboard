import { useState } from "react";
import { Link } from "react-router-dom";
import './Login.css';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    return (
        <form id="login">
            <div class="box">
                <h1>Dashboard</h1>

                <input
                    type="email"
                    name="email"
                    value={email}
                    placeholder="email"
                    onChange={handleEmailChange}
                    className="email"
                />

                <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="password"
                    onChange={handlePasswordChange}
                    className="email"
                />

                <p id="forgot-password">
                    <Link to="/forgot-password">Forgot your password?</Link>
                </p>
                <a href="#"><div className="btn">Log In</div></a>

                <a href="#"><div id="btn2">Sign Up</div></a>

            </div>

        </form>

    );
};

export default Login;