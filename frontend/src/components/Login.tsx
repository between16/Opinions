import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"

// Define the response types expected from the backend
interface LoginResponse {
  message: string;
}

const Login = () => {
  const navigate = useNavigate();

  // Communication with the backend to send the login information
  async function sendDataLogin(userName: string, userPassword: string): Promise<void> {
    try {
      const response = await axios.post<LoginResponse>("http://127.0.0.1:5000/api/login", {
        username: userName,
        password: userPassword,
      });
      if (response.data.message === "Incorrect") {
        alert("Credenziali errate. Riprova.");
        navigate("/");
      } else {
        navigate("/Home");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Communication with the backend to sign up a new user
  async function sendDataSignUp(userName: string, userPassword: string): Promise<void> {
    try {
      const response = await axios.post<LoginResponse>("http://127.0.0.1:5000/api/signUp", {
        username: userName,
        password: userPassword,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      response.data.message === "Done"
        ? navigate("/Home")
        : alert("Username already exists");
    } catch (error) {
      console.error(error);
    }
  }

  // Verification of the login based on the backend response
  const handleLogin = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const currUser = (form.username as HTMLInputElement).value;
    const currPassword = (form.password as HTMLInputElement).value;

    if (window.location.pathname.endsWith("/")) {
      sendDataLogin(currUser, currPassword);
    } else {
      sendDataSignUp(currUser, currPassword);
    }

    localStorage.setItem("username", currUser);
  };

  const welcomeMessage = window.location.pathname.endsWith("/")
    ? "LOGIN TO PLAY"
    : "SIGN UP TO PLAY";
  const buttonText = window.location.pathname.endsWith("/") ? "LOGIN" : "SIGN UP";

  return (
    <div className="loginDiv">
      <h2>{welcomeMessage}</h2>
      <form className="loginForm" onSubmit={handleLogin}>
        <label htmlFor="username">Username: </label>
        <input type="text" placeholder="username..." name="username" required />
        <label htmlFor="password">Password: </label>
        <input type="password" placeholder="password..." name="password" required />
        <div className="logButton">
          <button className="button" type="submit">
            {buttonText}
          </button>
        </div>
      </form>
      <div className="SignUpLink">
        {window.location.pathname.endsWith("/") && <Link to="/SignUp">Sign Up</Link>}
      </div>
    </div>
  );
};

export default Login;
