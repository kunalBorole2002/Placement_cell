import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

import { useNavigate } from 'react-router-dom';


// Soft UI Dashboard React context
import { useSoftUIController, setMiniSidenav } from "context";

function Sidenav({ color, brand, brandName, routes, user, ...rest }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const navigate = useNavigate();

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  const handleSignOut = () => {
    // Clear user session data and redirect to the sign-in page
    localStorage.clear();
    navigate('/authentication/sign-in', { replace: true });
  };


  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, route, href }) => {
    let returnValue;
    // check if the user is logged in as an admin
    let isAdmin = false;
    let isStudent = false;
    if (user === 'admin') {
      isAdmin = true;
    }else if (user === 'student') {
      isStudent = true;
    }

    if (type === "collapse") {
      // if the link is Studentbilling and the user is an admin, hide the link
      if (key === 'StudentComapanies' && isAdmin) {
        return null;
      }
      if (key === 'StudentsProfile' && isAdmin) {
        return null;
      }
      if (key === 'resume' && isAdmin) {
        return null;
      }
      // if the link is Dashboard and the user is a student, hide the link
      if ( name === 'Dashboard' && isStudent) {
        return null;
      }
      if ( key === 'tables' && isStudent) {
        return null;
      }
      if ( key === 'billing' && isStudent) {
        return null;
      }
      returnValue = href ? (
          <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
                color={color}
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
            />
          </Link>
      ) : (
          <NavLink to={route} key={key}>
            <SidenavCollapse
                color={color}
                key={key}
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
            />
          </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
          <SoftTypography
              key={key}
              display="block"
              variant="caption"
              fontWeight="bold"
              textTransform="uppercase"
              opacity={0.6}
              pl={3}
              mt={2}
              mb={1}
              ml={1}
          >
            {title}
          </SoftTypography>
      );
    } else if (type === "divider") {
      returnValue = <Divider key={key} />;
    }

    return returnValue;
  }).filter(Boolean);

  return (
    <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <SoftBox pt={3} pb={1} px={4} textAlign="center">
        <SoftBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <SoftTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          {brand && <SoftBox component="img" src={brand} alt="JobHive" width="2rem" />}
          <SoftBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <SoftTypography component="h6" fontWeight="bold">
              {brandName}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <Divider />
      <List>{renderRoutes}</List>
      <SoftBox pt={2} my={2} mx={2} mt="auto">
        <SoftBox mt={2}>
          <SoftButton
            component="a"
            target="_self"
            onClick={handleSignOut}
            rel="noreferrer"
            variant="gradient"
            color={color}
            fullWidth
          >
            Sign out
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "primary",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  user: PropTypes.string,
  color: PropTypes.oneOf(["info", "secondary", "primary", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
