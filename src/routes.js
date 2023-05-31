import DashboardIcon from '@material-ui/icons/Assessment';
import StudentComapaniesIcon from '@material-ui/icons/Business';
import StudentsIcon from '@material-ui/icons/Group';
import StudentsProfileIcon from '@material-ui/icons/AccountCircle';
import ResumeIcon from '@material-ui/icons/Description';
import SignInIcon from '@material-ui/icons/Lock';
import SignUpIcon from '@material-ui/icons/PersonAdd';

import Dashboard from "layouts/dashboard";
import StudentComapanies from "layouts/student/billing";
import Students from "layouts/tables";
import Billing from "layouts/billing";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import StudentsProfile from "layouts/student/tables"
import Resume from "layouts/student/resume"

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <DashboardIcon />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Comapanies",
    key: "StudentComapanies",
    route: "/StudentComapanies",
    icon: <StudentComapaniesIcon />,
    component: <StudentComapanies />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Students",
    key: "tables",
    route: "/tables",
    icon: <StudentsIcon />,
    component: <Students />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "StudentsProfile",
    route: "/StudentsProfile",
    icon: <StudentsProfileIcon />,
    component: <StudentsProfile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Companies",
    key: "billing",
    route: "/billing",
    icon: <StudentComapaniesIcon />,
    component: <Billing />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Resume",
    key: "resume",
    route: "/resume",
    icon: <ResumeIcon />,
    component: <Resume />,
    noCollapse: true,
  },
  {
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <SignInIcon />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SignUpIcon />,
    component: <SignUp />,
    noCollapse: true,
  },
];

export default routes;
