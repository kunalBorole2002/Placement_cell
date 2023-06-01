// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useState } from "react"; // import the useState hook

function Transaction({ id, color, icon, name, description, value }) {

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/incompanies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "inactive" }),
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <SoftBox key={name} component="li" py={1} pr={2} mb={1}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center">
          <SoftBox display="flex" alignItems="center">
            <SoftBox mr={2}>
              <SoftButton variant="outlined" color={color} size="small" iconOnly circular onClick={handleButtonClick}>
                <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon>
              </SoftButton>
            </SoftBox>
            <SoftBox display="flex" flexDirection="column">
              <SoftTypography variant="button" fontWeight="medium" gutterBottom>
                {name}
              </SoftTypography>
              <SoftTypography variant="caption" color="text">
                {description}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftTypography variant="button" color={color} fontWeight="medium" textGradient>
            {value}
          </SoftTypography>
        </SoftBox>
      </SoftBox>
  );
}

Transaction.propTypes = {
  id: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};


export default Transaction;
