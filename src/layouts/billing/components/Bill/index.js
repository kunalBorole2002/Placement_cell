import { useState } from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";


function Bill({ id, name, company, email, vat, noGutter, min_marks }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this company?");
    if (confirmed) {
      setIsUpdating(true);
      try {
        const response = await fetch(`http://localhost:3001/api/companies/${id}`, {
          method: "PATCH",
        });
        if (response.ok) {
          setIsUpdating(false);
          window.location.reload();
        } else {
          throw new Error("Failed to delete company");
        }
      } catch (error) {
        console.error(error);
        setIsUpdating(false);
      }
    }
  };

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

            <SoftBox
                display="flex"
                alignItems="center"
                mt={{ xs: 2, sm: 0 }}
                ml={{ xs: -1.5, sm: 0 }}
            >
              <SoftBox mr={1}>
                <SoftBox mr={1}>
                  <SoftButton
                      variant="text"
                      color="error"
                      disabled={isUpdating}
                      onClick={handleUpdate}
                  >
                    <Icon>delete</Icon>&nbsp;delete
                  </SoftButton>
                </SoftBox>
              </SoftBox>
              <SoftButton variant="text" color="dark">
                <Icon>edit</Icon>&nbsp;edit
              </SoftButton>
            </SoftBox>
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
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Minimum Marks:&nbsp;&nbsp;&nbsp;
              <SoftTypography variant="caption" fontWeight="medium">
                {min_marks}
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
