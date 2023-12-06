import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import Loader from "./Loader";
import { loginUserAsync } from "../actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { isMobileDevice } from "../utils";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginUserAsync({ email, password }));
    console.log(res);
    navigate('/');
  };

  return (
    <>
      {loading && <Loader />}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundImage: `url("/Login.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Box
          component="div"
          sx={{
           
            width: isMobileDevice() ? "100%" : "340px",
            padding: "30px",
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Almost opaque white
            borderRadius: "15px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)", // Soft box shadow
            marginRight: isMobileDevice() ? "0" : "10%"
          }}
        >
          <Typography variant="h5" align="center" mb={3} color="textSecondary">
            Welcome Back
          </Typography>
          <Typography variant="subtitle1" mb={2} color="textSecondary">
            Sign in to continue
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                // Add this prop
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* ... rest of the form ... */}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              mt={3}
              style={{ height: "56px", marginBottom: "12px" }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/signup")}
              fullWidth
              style={{ height: "56px", marginBottom: "12px" }} // Added marginBottom for spacing
            >
              Sign Up
            </Button>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/forgot-password")} // Adjust this to your route
              underline="hover"
              sx={{ display: "block", textAlign: "center", mt: 2 }} // Centered and with some margin on top
            >
              Forgot Password?
            </Link>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Login;
