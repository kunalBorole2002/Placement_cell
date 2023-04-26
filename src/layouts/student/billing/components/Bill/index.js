// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import {useEffect, useState} from "react";

function Bill({ id, name, company, email, vat, noGutter, min_marks }) {
  const [eligible, setEligible] = useState("eligible");

  // Fetch the user type from the server
  useEffect(() => {
    async function fetchUserType() {
      const response = await fetch('http://localhost:3001/api/studentmarks');
      const data = await response.json();
      if(data.studentMarks < min_marks){
        setEligible("Not Eligible")
      } else {
        setEligible("Eligible")
      }
    }
    fetchUserType();
  }, []);


  return (
      <SoftBox
          component="li"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          bgColor="grey-100"
          borderRadius="lg"
          p={3}
          mb={noGutter ? 0 : 1}
          mt={2}
      >
        <SoftBox width="100%" display="flex" flexDirection="column">
          <SoftBox
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexDirection={{ xs: "column", sm: "row" }}
              mb={2}
          >
            <SoftTypography variant="button" fontWeight="medium" textTransform="capitalize">
              {name}
            </SoftTypography>

            <SoftTypography variant="body1" color="success" fontWeight="bold" textGradient= "true" >
              {eligible}
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Package :&nbsp;&nbsp;&nbsp;
              <SoftTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {company}
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Company Address:&nbsp;&nbsp;&nbsp;
              <SoftTypography variant="caption" fontWeight="medium">
                {email}
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
          <SoftTypography variant="caption" color="text">
            Date:&nbsp;&nbsp;&nbsp;
            <SoftTypography variant="caption" fontWeight="medium">
              {vat}
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Bill.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
  min_marks: PropTypes.string.isRequired
};

export default Bill;
