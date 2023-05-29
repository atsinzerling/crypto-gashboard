import './Login.css';

const Login = () => {
    //return 

    return (
        <body id="login">
            <div class="box">
                <h1>Dashboard</h1>

                <input type="email" name="email" value="email" onFocus="field_focus(this, 'email');" onblur="field_blur(this, 'email');" class="email" />

                <input type="password" name="email" value="email" onFocus="field_focus(this, 'email');" onblur="field_blur(this, 'email');" class="email" />

                <p>Forgot your password?</p>

                <a href="#"><div class="btn">Log In</div></a>

                <a href="#"><div id="btn2">Sign Up</div></a>

            </div>

        </body>

    );
};

export default Login;