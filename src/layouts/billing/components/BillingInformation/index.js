import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import React, { Fragment } from 'react';

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Checkbox, Chip, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// Billing page components
import Bill from "layouts/billing/components/Bill";

function CompanyInformation() {
    const [companies, setCompanies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [min_marks, setMin_marks] = useState("");
    const [cpackage, setPackage] = useState("");
    const [pbranch, setPbranch] = useState("");
    const status = "active";

    const [pbrancht, setPbrancht] = useState([]);
    const branchOptions = ["Computer Engineering", "Mechanical Engineering", "Electrical Engineering", "ENTC", "IT", "Civil Engineering"];

    const handleBranchChange = (event) => {
        const selectedValues = event.target.value;
        if (selectedValues.includes("discard")) {
            // if "discard" option is selected, remove it from selected values
            const filteredValues = selectedValues.filter((val) => val !== "discard");
            setPbrancht(filteredValues);
        } else {
            setPbrancht(selectedValues);
            setPbranch(selectedValues.join(","));
        }
    };


    useEffect(() => {
        fetch("http://localhost:3001/api/activecompanies")
            .then((res) => res.json())
            .then((data) => setCompanies(data))
            .catch((error) => console.error(error));
    }, []);

    const handleSubmit = () => {
        fetch("http://localhost:3001/api/companies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, location, date, cpackage, status,min_marks, pbranch }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setCompanies([...companies, { name, location, date, cpackage, min_marks, pbranch }]);
                    setName("");
                    setLocation("");
                    setDate("");
                    setPackage("");
                    setMin_marks("");
                    setShowForm(false);
                    setPbranch("Preferred Branch");
                }
            })
            .catch((error) => console.error(error));
    };

    const handleCancel = () => {
        setName("");
        setLocation("");
        setDate("");
        setPackage("");
        setMin_marks("");
        setPbranch("Preferred Branch")
        setShowForm(false);
    };

    return (
        <Card id="delete-account">
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight="medium">
                    Companies Information
                </Typography>
                <SoftButton color="primary" circular="true" variant="gradient" onClick={() => setShowForm(!showForm)}>
                    Add Company
                </SoftButton>
            </Box>
            {showForm && (
                <SoftBox sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <SoftBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <SoftInput
                              required
                              fullWidth
                              placeholder="Company Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                            <SoftInput
                              required
                              fullWidth
                              placeholder="Location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                            <SoftInput
                              required
                              fullWidth
                              placeholder="Date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                            />
                            <SoftInput
                              required
                              fullWidth
                              placeholder="Package"
                              value={cpackage}
                              onChange={(e) => setPackage(e.target.value)}
                            />
                            <SoftInput
                              required
                              fullWidth
                              placeholder="Minimum Marks"
                              value={min_marks}
                              onChange={(e) => setMin_marks(e.target.value)}
                            />
                            <Select
                              multiple
                              fullWidth
                              value={pbrancht}
                              onChange={handleBranchChange}
                              renderValue={(selected) =>
                                selected.length === 0 ? (
                                  <em>Preferred Branch</em>
                                ) : (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                      {selected.map((value) => (
                                        <Fragment key={value}>
                                            <Chip label={value} style={{ padding: '4px' }} />
                                        </Fragment>
                                      ))}
                                  </div>
                                )
                              }
                            >
                                {branchOptions.map((branch) => (
                                  <MenuItem key={branch} value={branch} style={{ marginTop: '7px' }}>
                                      <Checkbox checked={pbrancht.includes(branch)} />
                                      <ListItemText primary={branch} />
                                  </MenuItem>
                                ))}
                            </Select>
                            <SoftBox sx={{ display: "flex", justifyContent: "space-between" }}>
                                <SoftButton color="primary" circular="true" variant="gradient" type="submit">
                                    Submit
                                </SoftButton>
                                <SoftButton color="primary" circular="true" variant="gradient" onClick={handleCancel}>
                                    Cancel
                                </SoftButton>
                            </SoftBox>
                        </SoftBox>
                    </form>
                </SoftBox>
            )}
            <Box sx={{ p: 3 }}>
                <Box component="ul" display="flex" flexDirection="column" p={0} m={0}>
                    {companies.map((company) => (
                        <Bill
                            key={company._id} // use _id field as the key
                            id={company._id} // pass _id field as the id prop
                            name={company.name}
                            company={company.cpackage}
                            email={company.location}
                            min_marks = {company.min_marks}
                            pbranch = {company.pbranch}
                            vat={company.date}
                        />
                    ))}
                </Box>
            </Box>
        </Card>
    );
}

export default CompanyInformation;
