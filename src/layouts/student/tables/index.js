import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import React, {useCallback, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography, TextField, Button, Avatar } from '@material-ui/core';
import SoftInput from "components/SoftInput";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

import team2 from "assets/images/team2.png";
import team1 from "assets/images/team1.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const useStyles = makeStyles((theme) => ({
    maincard: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'center'

    },
    card: {
        padding: theme.spacing(4),
        boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: 12,
    },
    avatar: {
        width: theme.spacing(25),
        height: theme.spacing(25),
        margin: 'auto',
    },
    buttonGroup: {
        marginTop: theme.spacing(4),
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            marginRight: theme.spacing(2),
        },
    },
}));

export default function StudentsProfile() {
    const [name, setName] = useState('');
    const [stuid, setStuid] = useState('123');
    const [marks, setMarks] = useState('loading');
    const [status, setStatus] = useState('');
    const [branch, setBranch] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [genderc, setGenderc] = useState(false);
    const [isContentChanged, setIsContentChanged] = useState(false);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchLoggedInUser() {
            const response = await fetch('http://localhost:3001/api/getstudent');
            const data = await response.json();
            console.log("logging data",data[0]);
            setName(data[0].name);
            setMarks(data[0].marks);
            setStatus(data[0].status);
            setBranch(data[0].branch);
            setEmail(data[0].email);
            setGender(data[0].gender);
            setStuid(data[0]._id);
        }
        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        const names = name.split(' ');
        setFname(names[0]);
        setLname(names[1]);
        setGenderc(gender === "male" ? team2 : team1);
    }, [name]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "fname":
                setFname(value);
                break;
            case "lname":
                setLname(value);
                break;
            case "marks":
                setMarks(value);
                break;
            case "branch":
                setBranch(value);
                break;
            case "status":
                setStatus(value);
                break;
            default:
                break;
        }
        setIsContentChanged(true);
    };

    const handleCancel = () => {
        // Reset form fields to original content
        setIsContentChanged(false);
    };

    const handleSubmit = () => {
        console.log("updating student", fname, lname);
        fetch(`http://localhost:3001/api/updatestudent/${stuid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullname: fname + " " + lname,
                marks,
                branch,
                status
            })
        })
            .then(response => response.json())
            .then(data => {
                setMessage(`Profile updated successfully`);
                setOpen(true);
                setIsContentChanged(false);
            })
            .catch(error => console.error(error));
    }


    const classes = useStyles();

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container spacing={3} className={classes.maincard}>
                <Grid item md={8}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Avatar className={classes.avatar} src={genderc} />
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <SoftTypography fontWeight="medium" variant="h6">
                                        Personal Details
                                    </SoftTypography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SoftInput
                                        id="firstname"
                                        placeholder="First Name"
                                        name="fname"
                                        value={fname}
                                        onChange={handleInputChange}
                                        variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SoftInput id="lastname"
                                               placeholder="Last Name"
                                               name="lname"
                                               value={lname}
                                               onChange={handleInputChange}
                                               variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SoftInput disabled="disabled" value={email} placeholder="Email Address" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SoftInput id="Gender" disabled="disabled" value={gender} placeholder="Gender" variant="outlined" fullWidth />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <SoftTypography variant="h6" >
                                        Educational Details
                                    </SoftTypography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SoftInput id="Branch"
                                               placeholder="Branch"
                                               name="branch"
                                               value={branch}
                                               onChange={handleInputChange}
                                               variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SoftInput id="Status"
                                               placeholder="Status"
                                               value={status}
                                               name="status"
                                               onChange={handleInputChange}
                                               variant="outlined"
                                               fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SoftInput id="Marks"
                                               placeholder="Marks"
                                               value={marks}
                                               name="marks"
                                               onChange={handleInputChange}
                                               variant="outlined"
                                               fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                </Grid>
                            </Grid>
                            {isContentChanged && (
                                <div className={classes.buttonGroup}>
                                    <SoftButton
                                        size="medium"
                                        circular="true"
                                        variant="gradient"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </SoftButton>
                                    <SoftButton
                                        size="medium"
                                        circular="true"
                                        variant="gradient"
                                        color="primary"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </SoftButton>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {message}
                </MuiAlert>
            </Snackbar>
        </DashboardLayout>
    );
}


