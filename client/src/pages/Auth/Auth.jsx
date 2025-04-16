import React, { useState } from "react";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { logIn, signUp } from "../../actions/AuthActions.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmpass: "",
  };

  const loading = useSelector((state) => state.authReducer.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);

  const [data, setData] = useState(initialState);

  const [confirmPass, setConfirmPass] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages

  // Reset Form
  const resetForm = () => {
    setData(initialState);
    setConfirmPass(true); // Reset confirmPass properly
    setErrorMessage(""); // Clear error messages
  };

  // Handle input changes
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error messages

    if (isSignUp) {
      if (data.password !== data.confirmpass) {
        setConfirmPass(false);
        setErrorMessage("Passwords do not match.");
        return;
      }

      try {
        const result = await dispatch(signUp({ userData: data, navigate }));
        console.log("Full response:", result);

        if (result?.error) {
          setErrorMessage(
            typeof result.error === "object"
              ? result.error.message
              : result.error
          ); // Handle object or string error
        }
      } catch (error) {
        console.error("Complete error:", {
          message: error.message,
          response: error.response?.data,
          stack: error.stack,
        });
        setErrorMessage("Something went wrong. Please try again.");
      }
    } else {
      try {
        const result = await dispatch(logIn(data, navigate));
        console.log("Login response:", result);

        if (result?.error) {
          setErrorMessage("Invalid credentials. Please try again.");
        }
      } catch (error) {
        console.error("Login error:", {
          message: error.message,
          response: error.response?.data,
          stack: error.stack,
        });
        setErrorMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="Auth">
      {/* Left side */}
      <div className="a-left">
        <img src={Logo} alt="" />

        <div className="Webname">
          <h1>ZKC Media</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div>
      </div>

      {/* Right form side */}
      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h3>{isSignUp ? "Register" : "Login"}</h3>

          {isSignUp && (
            <div>
              <input
                required
                type="text"
                placeholder="First Name"
                className="infoInput"
                name="firstname"
                value={data.firstname}
                onChange={handleChange}
              />
              <input
                required
                type="text"
                placeholder="Last Name"
                className="infoInput"
                name="lastname"
                value={data.lastname}
                onChange={handleChange}
              />
            </div>
          )}

          {isSignUp && (
            <div>
              <input
                required
                type="email"
                placeholder="Email"
                className="infoInput"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <input
              required
              type="text"
              placeholder="Username"
              className="infoInput"
              name="username"
              value={data.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              required
              type="password"
              className="infoInput"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            {isSignUp && (
              <input
                required
                type="password"
                className="infoInput"
                name="confirmpass"
                placeholder="Confirm Password"
                value={data.confirmpass}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Password mismatch error */}
          {(!confirmPass || errorMessage) && (
            <span
              style={{
                color: "red",
                fontSize: "12px",
                alignSelf: "flex-end",
                marginRight: "5px",
                display: "block",
              }}
            >
              {errorMessage || "* Confirm password does not match"}
            </span>
          )}

          <div>
            <span
              style={{
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                resetForm();
                setIsSignUp((prev) => !prev);
              }}
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </span>
            <button
              className="button infoButton"
              type="Submit"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;