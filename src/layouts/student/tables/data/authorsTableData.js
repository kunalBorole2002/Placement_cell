/* eslint-disable react/prop-types */
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";

// Images
import team1 from "assets/images/team1.png";
import team2 from "assets/images/team2.png";

function Student({ image, name, email }) {
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2}>
        <SoftAvatar src={image} alt={name} size="sm" variant="rounded" />
      </SoftBox>
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="button" fontWeight="medium">
          {name}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {email}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}
function Branch({ job }) {
  return (
    <SoftBox display="flex" flexDirection="column">
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {job}
      </SoftTypography>
    </SoftBox>
  );
}

// authorsTableData.js
const authorsTableData = {
    columns: [
        { name: "student", align: "left" },
        { name: "branch", align: "left" },
        { name: "status", align: "center" },
        { name: "action", align: "center" },
    ],

    rows: [],
};

// Fetch data from MongoDB and populate rows array
fetch('http://localhost:3001/api/students')
    .then(response => response.json())
    .then(students => {
        const rows = students.map(student => ({
            student: <Student image={student.gender === "male" ? team1 : team2} name={student.name} email={student.email} />,
            branch: <Branch job={student.branch}/>,
            status: (
                <SoftBadge variant="gradient" badgeContent={student.status} color={student.status === "placed" ? "success" : "secondary"} size="xs" container />
            ),
            action: (
                <SoftTypography
                    component="a"
                    href="#"
                    variant="caption"
                    color="secondary"
                    fontWeight="medium"
                >
                    Edit
                </SoftTypography>
            ),
        }));
        authorsTableData.rows = rows;
    })
    .catch(error => console.error(error));

export default authorsTableData;


