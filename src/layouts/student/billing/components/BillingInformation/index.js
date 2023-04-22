// @mui material components
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Billing page components
import Bill from "layouts/student/billing/components/Bill";

function CompanyInformation() {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/api/companies")
            .then((res) => res.json())
            .then((data) => setCompanies(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <Card id="delete-account">
            <SoftBox pt={3} px={2}>
                <SoftTypography variant="h6" fontWeight="medium">
                    Companies Information
                </SoftTypography>
            </SoftBox>
            <SoftBox pt={1} pb={2} px={2}>
                <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                    {companies.map((company) => (
                        <Bill
                            key={company.id}
                            name={company.name}
                            company={company.package}
                            email={company.location}
                            vat={company.date}
                        />
                    ))}
                </SoftBox>
            </SoftBox>
        </Card>
    );
}

export default CompanyInformation;