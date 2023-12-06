import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import {resetPasswordAsync} from "../actions/auth";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e) => {
    try {
      e.preventDefault();
      // You'll need a resetPasswordAsync action to dispatch the password reset
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      const token = params.get("token");
      const resp = dispatch(resetPasswordAsync({password, token, email}));
      console.log(resp);
      navigate('/');
    } catch (err) {
      console.log(err)
    }
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
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Almost opaque white
            borderRadius: "15px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)", // Soft box shadow
            marginRight: "10%",
          }}
        >
          <Typography variant="h5" align="center" mb={3} color="textSecondary">
            Reset Password
          </Typography>
          <form onSubmit={handleReset}>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
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

            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              variant="outlined"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              style={{ height: "56px" }}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Reset Password
            </Button>
          </form>
          {error && (
            <Typography variant="body2" color="error" align="center" mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ResetPassword;
