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
  const handleSetAgreement = () => setAgreement(!agreement);
  const handleSignUp = async () =>{
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
      description="create new account ."
      image={curved6}
    >
      <Card style={{ width: "500px" ,marginLeft: "-100px"}}>
        <SoftBox p={3} mb={1} textAlign="center" >
          <SoftTypography variant="h5" fontWeight="medium">
            Register with
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={2} style = {{display: "flex",
          alignItems: "center",
          justifyContent: "center"}}>
          {/*<Socials/>*/}
          <GoogleOAuthProvider clientId="303527137331-g5ktm9b6u4fj9p7j5t6dvvhkk7sfgj9g.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={credentialResponse => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
            />
          </GoogleOAuthProvider>
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
                  placeholder="Name"
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
              <SoftInput
                  placeholder="Branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
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
                Status
              </SoftTypography>
            </SoftBox>
              <SoftInput
                  placeholder="placed or unplaced"
                  value={status}
                  onChange={(e) => setPstatus(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
              <SoftButton variant="gradient" color="dark" fullWidth onClick={handleSignUp}>
                sign up
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
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
