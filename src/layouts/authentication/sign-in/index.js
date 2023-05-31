import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.jpg";
import './style.css';

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [usertype, setUser] = useState();

  // Fetch the user type from the server
  const fetchUserType = async () => {
    const response = await fetch('http://localhost:3001/api/usertype');
    const data = await response.json();
    setUser(data.userType);
  };

  useEffect(() => {
    fetchUserType();
  }, []);

  const handleSignIn = async () => {
    if(email.length === 0 || password.length === 0){
      setErrorMessage("please enter your email and password");
      return
    }
    const response = await fetch('http://localhost:3001/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const user = await response.json();
    if (response.ok) {
      // Check if user object is not empty
      if (Object.keys(user).length === 0 && user.constructor === Object) {
        setErrorMessage("Invalid email or password");
      } else {
        // Check if the fetched user's email and password matches with the provided email and password
        if (user.email === email && user.password === password) {
          fetchUserType();
          console.log("Checking",isAdmin,usertype);
          if (isAdmin && usertype === 'admin') {
            setUser("null");
            window.location.href = "/dashboard";
          }else if ((!isAdmin && usertype === 'student')){
            setUser("null");
            window.location.href = "/StudentComapanies";
          }
        } else {
          setErrorMessage("Invalid email or password");
        }
      }
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  const handleAdminClick = () => {
    setIsAdmin(true);
  }

  const handleStudentClick = () => {
    setIsAdmin(false);
  }
  console.log(isAdmin);

  return (
      <CoverLayout
          title="Welcome back"
          description="Enter your email and password to sign in"
          image={curved9}
      >
        <SoftBox component="form" role="form">
          <SoftBox mb={2}>
            <div className="button-group">
              <button type="button" className={isAdmin ? "admin-button active" : "admin-button"} onClick={handleAdminClick}>Admin</button>
              <button type="button" className={!isAdmin ? "student-button active" : "student-button"} onClick={handleStudentClick}>Student</button>
            </div>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
              >
                Email
              </SoftTypography>
            </SoftBox>
            <SoftInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  border: errorMessage && "1px solid red",
                }}
            />
          </SoftBox>
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
              >
                Password
              </SoftTypography>
            </SoftBox>
            <SoftInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  border: errorMessage && "1px solid red",
                }}
            />
          </SoftBox>
          {errorMessage && (
              <SoftTypography
                  variant="caption"
                  color="error"
                  mt={1}
                  mb={2}
                  textAlign="center"
              >
                {errorMessage}
              </SoftTypography>
          )}
          <SoftBox mt={4} mb={1}>
            <SoftButton
                variant="gradient"
                color="primary"
                fullWidth
                onClick={handleSignIn}
            >
              <SoftTypography
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
              >
                Sign in
              </SoftTypography>
            </SoftButton>
          </SoftBox>
          <SoftBox mt={3} textAlign="center">
            <SoftTypography
                variant="button"
                color="text"
                fontWeight="regular"
            >
              Don&apos;t have an account?{" "}
              <SoftTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  fontWeight="bold"
              >
                Sign up
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </CoverLayout>
  );
}

export default SignIn;
