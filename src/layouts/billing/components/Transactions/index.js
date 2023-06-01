//index2.js

import { useState, useEffect } from 'react';

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('http://localhost:3001/api/companies');
        const companies = await response.json();

        // Map the companies to transactions
        const newTransactions = companies.map(company => {

          const id = company._id;
          // Set the transaction name
          const name = company.name;

          // Set the transaction description to the company date
          const description = company.date;

          // Set the transaction value to the company package
          const value = company.package;

          // Set the transaction color based on the company status
          const color = company.status === 'active' ? 'success' : 'error';

          const icon = company.status === 'active' ? 'arrow_downward' : 'arrow_upward';

          return {id, name, description, value, icon , color };
        });

        setTransactions(newTransactions);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTransactions();
  }, []);

  return (
      <Card sx={{ height: "100%" }}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
          <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            Total Companies
          </SoftTypography>
          <SoftBox display="flex" alignItems="flex-start">
            <SoftBox color="text" mr={0.5} lineHeight={0}>
              <Icon color="inherit" fontSize="small">
                date_range
              </Icon>
            </SoftBox>
            <SoftTypography variant="button" color="text" fontWeight="regular">
              {/* Replace the hardcoded date with a dynamic one */}
              4/22/2022
              {" - "}
              {new Date().toLocaleDateString()}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox pt={3} pb={2} px={2}>
          <SoftBox mb={2}>
            <SoftTypography
                variant="caption"
                color="text"
                fontWeight="bold"
                textTransform="uppercase"
            >
              newest
            </SoftTypography>
          </SoftBox>
          <SoftBox
              component="ul"
              display="flex"
              flexDirection="column"
              p={0}
              m={0}
              sx={{ listStyle: "none" }}
          >
            {/* Map the transactions to Transaction components */}
            {transactions.map((transaction, index) => (
                <Transaction
                    id = {transaction.id}
                    key={index}
                    color={transaction.color}
                    icon={transaction.icon}
                    name={transaction.name}
                    description={transaction.description}
                    value={transaction.value}
                />
            ))}
          </SoftBox>
        </SoftBox>
      </Card>
  );
}

export default Transactions;