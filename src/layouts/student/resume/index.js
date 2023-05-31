import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import {Avatar, Button, CardContent, Grid} from "@material-ui/core";
import SoftInput from "../../../components/SoftInput";
import SoftButton from "../../../components/SoftButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Document, Page, pdfjs } from "react-pdf";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { Viewer } from '@react-pdf-viewer/core';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {IconButton} from "@mui/material";

// Create new plugin instance


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Resume() {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [stuid, setStuid] = useState(123);
    const [present, setPresent] = useState(false);
    const [display, setDisplay] = useState(false);
    const [resume, setResume] = useState(null);
    const [showUploadButton, setShowUploadButton] = useState(true);
    const [message, setMessage] = useState(false);
    const [file, setFile] = useState(false);
    const [open, setOpen] = useState(false);
    const [resumeUrl, setResumeUrl] = useState(null);

    const handleFile = async (event) => {
        setResume(event.target.files[0]);
        setFile(true);
    };

    useEffect(() => {
        async function fetchLoggedInUser() {
            const response = await fetch('http://localhost:3001/api/loggedin');
            const data = await response.json();
            setStuid(data.studentid);
        }
        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        async function checkResume() {
            try {
                console.log("Student id", stuid);
                const response = await fetch(`http://localhost:3001/api/checkresume/${stuid}`);
                const data = await response.json();
                console.log("checking", data.exists);
                setPresent(data.exists);
                if (data.exists) {
                    fetchResume();
                }
            } catch (error) {
                console.error(error);
            }
        }

        checkResume();
    }, [stuid]);

    const handleResumeUpdate = async (event) => {
        const fileInput = event.target;
        if (!fileInput) {
            console.error('File input is undefined');
            return;
        }
        const file = fileInput.files?.[0];
        if (!file) {
            console.error('No file selected');
            return;
        }
        const formData = new FormData();
        formData.append('resume', file);
        try {
            const response = await fetch(`http://localhost:3001/api/resume/${stuid}`, {
                method: 'PUT',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to update resume');
            }
            const data = await response.json();
            setResumeUrl(`/resumes/${data.resume}`);
            window.location.reload();
            setMessage("Resume updated successfully");
            setOpen(true);
        } catch (error) {
            console.error(error);
        }
    };




    const handleResumeUpload = async (event) => {
        if (!file) {
            setMessage("File not selected");
            return;
        }
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("studentId", stuid);
        try {
            const response = await fetch("http://localhost:3001/api/resume", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message);
            console.log("1st url",`/resumes/${data.resume}`)
            setResumeUrl(`/resumes/${data.resume}`);
            setShowUploadButton(false);
            fetchResume();
        } catch (error) {
            console.error(error);
        }
        setMessage("Resume uploaded successfully");
        setOpen(true);
    };

    async function fetchResume() {
        try {
            const response = await fetch(`http://localhost:3001/api/resume/${stuid}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setResumeUrl(url);
            setShowUploadButton(false);
            setDisplay(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container justifyContent="center">
                <Grid item xs={12} md={8} lg={10}>
                    <Card>
                        <CardContent>
                            <SoftBox py={3}>
                                {showUploadButton && !present && (
                                    <>
                                        <SoftTypography variant="h6" fontWeight="medium" style={{ marginBottom:"1rem" }}>
                                            Upload Resume
                                        </SoftTypography>

                                        <SoftInput
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFile}
                                        />
                                        <div style={{ paddingTop: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <SoftButton style={{ marginTop:"1rem" }} color="primary" variant="gradient" component="label" onClick={handleResumeUpload}>
                                                Upload Resume
                                            </SoftButton>
                                        </div>
                                    </>
                                )}
                                {!showUploadButton && display && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    startIcon={<CloudUploadIcon />}
                                                >
                                                    Upload New Resume
                                                    <input type="file"
                                                           accept="application/pdf"
                                                           onChange={handleResumeUpdate}
                                                           id="resume-upload"
                                                           style={{ display: 'none' }} hidden />
                                                </Button>
                                        </div>
                                        {resumeUrl && (
                                            <div style={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                <SoftTypography variant="h6" fontWeight="medium" style={{ marginBottom:"1rem" }}>
                                                    Your Resume
                                                </SoftTypography>
                                                <Viewer
                                                    fileUrl= {resumeUrl}
                                                    plugins={[
                                                        // Register plugins
                                                        defaultLayoutPluginInstance
                                                    ]}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </SoftBox>
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

export default Resume;

