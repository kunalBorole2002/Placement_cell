import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Billing page components
import Bill from "layouts/student/billing/components/Bill";

function CompanyInformation() {
    const [companies, setCompanies] = useState([]);
    const [student, setStudent] = useState();
    const [studentb, setStudentb] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:3001/api/activecompanies"),
            fetch("http://localhost:3001/api/studentmarks")
        ])
            .then((responses) => {
                return Promise.all(responses.map((response) => response.json()));
            })
            .then((data) => {
                setCompanies(data[0]);
                setStudent(data[1].student[0].marks);
                setStudentb(data[1].student[0].branch);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <Card id="delete-account">
                <SoftBox display="flex" alignItems="center" justifyContent="center" height={200}>
                    <CircularProgress />
                </SoftBox>
            </Card>
        );
    }

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
                            key={company._id}
                            id={company._id}
                            name={company.name}
                            company={company.cpackage}
                            email={company.location}
                            minmarks={company.min_marks}
                            studentmarks={student}
                            studentbr = {studentb}
                            cpbranch = {company.pbranch}
                            vat={company.date}
                        />
                    ))}
                </SoftBox>
            </SoftBox>
        </Card>
    );
}

export default CompanyInformation;