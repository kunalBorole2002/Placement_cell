import { useState } from "react";
import React,{Component} from 'react';
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";
import curved6 from "assets/images/curved-images/curved14.jpg";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import { MenuItem, Select } from "@mui/material";

function SignUp(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setPstatus] = useState("");
  const [marks, setMarks] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agreement, setAgreement] = useState(true);
  const branchOptions = ["Computer Engineering", "Mechanical Engineering", "Electrical Engineering", "ENTC", "IT", "Civil Engineering"];
  const statusOptions = ["Placed", "Unplaced"];

  const handleSetAgreement = () => setAgreement(!agreement);

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const isPasswordValid = (password) => {
    // Add your password validation logic here
    return password.length >= 6;
  };

  const isFormValid = () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return false;
    }

    if (!isEmailValid(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (email.indexOf("@stvincentngp.edu.in") === -1) {
      setErrorMessage("Please use your college email address.");
      return false;
    }

    if (!gender.trim()) {
      setErrorMessage("Please select your gender.");
      return false;
    }

    if (!branch.trim()) {
      setErrorMessage("Please select your branch.");
      return false;
    }

    if (!status.trim()) {
      setErrorMessage("Please select your placement status.");
      return false;
    }

    if (!marks.trim() || isNaN(marks)) {
      setErrorMessage("Please enter valid marks.");
      return false;
    }

    if (!isPasswordValid(password)) {
      setErrorMessage("Password should be at least 6 characters long.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); // add e parameter here
    if (!isFormValid()) {
      return;
    }
    // make changes
    const response = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name,email,gender,branch,status,marks,password }),
    });
    console.log(response.ok);
    if (response.ok) {
      console.log('Forwarding to students dashboard successfully')
      window.location.href = "/studentdashboard";
    } else {
      const errorMessage = await response.text();
      setErrorMessage(errorMessage);
    }
  }


  return (
    <BasicLayout
      title="Welcome!"
      description="create new account "
      image={curved6}
    >
      <Card style={{ width: "500px" ,marginLeft: "-100px"}}>
        <SoftBox p={3} mb={1} textAlign="center" >
          <SoftTypography variant="h5" fontWeight="medium">
            Register
          </SoftTypography>
        </SoftBox>
        <Separator />
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                >
                  Name
                </SoftTypography>
              </SoftBox>
              <SoftInput
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                Gender
              </SoftTypography>
            </SoftBox>
              <SoftInput
                  placeholder="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
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
                Branch
              </SoftTypography>
            </SoftBox>
              <Select
                fullWidth
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Branch
                </MenuItem>
                {branchOptions.map((branch) => (
                  <MenuItem key={branch} value={branch} style={{marginTop:"0.4rem"}}>
                    {branch}
                  </MenuItem>
                ))}
              </Select>

            </SoftBox>
            <SoftBox mb={2}>
              <SoftBox mb={1} ml={0.5}>
              <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
              >
                Status
              </SoftTypography>
            </SoftBox>
              <Select
                fullWidth
                value={status}
                onChange={(e) => setPstatus(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Status
                </MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status} style={{marginTop:"0.4rem"}}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </SoftBox>
            <SoftBox mb={2}>
              <SoftBox mb={1} ml={0.5}>
              <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
              >
                Marks
              </SoftTypography>
            </SoftBox>
              <SoftInput
                  placeholder="Aggregate percentage of prev semester"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value) }
                  sx={{
                    border: errorMessage && "1px solid red",
                  }}
              />
            </SoftBox>
            <SoftBox display="flex" alignItems="center">
              <Checkbox checked={agreement} onChange={handleSetAgreement} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={handleSetAgreement}
                sx={{ cursor: "poiner", userSelect: "none" }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </SoftTypography>
              <SoftTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                textGradient
              >
                Terms and Conditions
              </SoftTypography>
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton disabled={!agreement} variant="gradient" color="dark" fullWidth onClick={handleSignUp}>
                sign up
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography  variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
