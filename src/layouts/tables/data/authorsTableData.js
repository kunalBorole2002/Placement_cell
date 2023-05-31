/* eslint-disable react/prop-types */
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";
import Button from "@material-ui/core/Button";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

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
fetchAuthorsTableData();
// authorsTableData.js
const authorsTableData = {
    columns: [
        { name: "student", align: "left" },
        { name: "branch", align: "left" },
        { name: "status", align: "center" },
        { name: "Resume", align: "center" },
    ],

    rows: [],
};

// Fetch data from MongoDB and populate rows array
function fetchAuthorsTableData() {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3001/api/students")
            .then((response) => response.json())
            .then((students) => {
                const rows = students.map((student) => ({
                    student: (
                        <Student
                            image={student.gender === "Male" ? team1 : team2}
                            name={student.name}
                            email={student.email}
                        />
                    ),
                    branch: <Branch job={student.branch}/>,
                    status: (
                        <SoftBadge
                            variant="gradient"
                            badgeContent={student.status}
                            color={student.status === "Placed" ? "success" : "secondary"}
                            size="xs"
                            container
                        />
                    ),
                    Resume: (
                        <CloudDownloadIcon
                            style={{alignItems: 'center', cursor: 'pointer'}}
                            aria-label="Download Resume"
                            onClick={() => {
                                fetch(`http://localhost:3001/api/resume/${student._id}`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/pdf',
                                    },
                                })
                                    .then((response) => {
                                        if (response.ok) {
                                            return response.blob();
                                        } else {
                                            throw new Error('Resume not found');
                                        }
                                    })
                                    .then((blob) => {
                                        const downloadLink = document.createElement('a');
                                        const url = window.URL.createObjectURL(new Blob([blob]));
                                        downloadLink.href = url;
                                        downloadLink.setAttribute('download', `${student.name.replace(/\s+/g, '_')}_resume.pdf`);
                                        document.body.appendChild(downloadLink);
                                        downloadLink.click();
                                        downloadLink.remove();
                                        window.URL.revokeObjectURL(url);
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        const rows = [...authorsTableData.rows];
                                        const index = rows.findIndex((row) => row.student.props.name === student.name);
                                        rows[index].Resume = (
                                            <SoftBox display="flex" alignItems="center">
                                                <ErrorOutlineIcon style={{marginRight: '0.5rem'}} color="error"/>
                                                <SoftTypography variant="caption" color="error">
                                                    {`${student.name} has not yet provided a copy of their resume`}
                                                </SoftTypography>
                                            </SoftBox>
                                        );
                                        authorsTableData.rows = rows;

                                        // Display snackbar alert message
                                        const snackbar = document.createElement('div');
                                        snackbar.innerHTML = `
                                                <div style="
                                                    position: fixed;
                                                    bottom: 2rem;
                                                    left: 50%;
                                                    transform: translateX(-50%);
                                                    background-color: #f44336;
                                                    color: #fff;
                                                    padding: 1rem;
                                                    border-radius: 0.5rem;
                                                    display: flex;
                                                    align-items: center;
                                                ">
            <ErrorOutlineIcon style={{ marginRight: '0.5rem' }} />
            <span>${student.name} has not yet provided a copy of their resume</span>
        </div>
    `;
                                        document.body.appendChild(snackbar);

                                        setTimeout(() => {
                                            snackbar.remove();
                                        }, 5000);
                                    });

                            }}
                        />


                    ),
                }));
                authorsTableData.rows = rows;
                resolve(authorsTableData); // resolve the data once fetched and populated
            }).catch((error) => {
            console.error(error);
            reject(error); // reject the promise if there is an error
        });
    });
}

export default authorsTableData;
