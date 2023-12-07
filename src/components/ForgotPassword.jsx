import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { forgotPasswordAsync } from "../actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(forgotPasswordAsync(email));
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
            width: "340px",
            padding: "30px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)",
            marginRight: "10%",
          }}
        >
          <Typography variant="h5" align="center" mb={3} color="textSecondary">
            Forgot Password
          </Typography>
          <Typography variant="subtitle1" mb={2} color="textSecondary">
            Enter your email to receive a password reset link.
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
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              mt={3}
              style={{ height: "56px", marginBottom: "12px" }}
            >
              Send Reset Link
            </Button>
          </form>
          {message && (
            <Typography variant="body2" align="center" mt={2}>
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ForgotPassword;
