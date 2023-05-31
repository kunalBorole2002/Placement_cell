import { useState } from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "../../../../components/SoftInput";
import { Dialog, DialogContent } from "@material-ui/core";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


function Bill({ id, name, company, email, vat, noGutter, min_marks, pbranch }) {
  const [cname, setCname] = useState(name);
  const [billCompany, setBillCompany] = useState(company);
  const [cdate, setCdate] = useState(vat);
  const [caddress, setCaddress] = useState(email);
  const [cminmarks, setCminmarks] = useState(min_marks);
  const [cpbranch, setPbranch] = useState(pbranch);


  const [isUpdating, setIsUpdating] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleEdit = async () => {
    setOpenPopup(true);
  };
  const handleCancel = async () => {
    setBillCompany(company);
    setCdate(vat);
    setCaddress(email);
    setCminmarks(min_marks);
    setPbranch(pbranch)
    setOpenPopup(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const companyId = document.getElementById('cid').value;
    const cpackage = document.getElementById('package').value;
    const location = document.getElementById('address').value;
    const min_marks = document.getElementById('min_marks').value;
    const date = document.getElementById('date').value;


    const response = await fetch(`http://localhost:3001/api/updatecompanies/${companyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cpackage: cpackage,
        location: location,
        min_marks: min_marks,
        date: date
      })
    });

    if (response.ok) {
      setOpenPopup(false);
      setOpen(true);
      setMessage(cname+" data updated successfully!")
    } else {
      console.error('Error updating company details');
    }
  };


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
              <SoftButton variant="text" color="dark" onClick={handleEdit}>
                <Icon>edit</Icon>&nbsp;edit
              </SoftButton>
            </SoftBox>
          </SoftBox>
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Package :&nbsp;&nbsp;&nbsp;
              <SoftTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {billCompany}
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Company Address:&nbsp;&nbsp;&nbsp;
              <SoftTypography variant="caption" fontWeight="medium">
                {caddress}
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Minimum Marks:&nbsp;&nbsp;&nbsp;
              <SoftTypography variant="caption" fontWeight="medium">
                {cminmarks}
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Preferred Branch:&nbsp;&nbsp;&nbsp;
              <SoftTypography variant="caption" fontWeight="medium">
                {cpbranch}
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
          <SoftTypography variant="caption" color="text">
            Date:&nbsp;&nbsp;&nbsp;
            <SoftTypography variant="caption" fontWeight="medium">
              {cdate}
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
        <Dialog
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          scroll="paper"
          fullWidth={true}
          PaperProps={{
            style: { borderRadius: "18px" },
          }}
        >
          <DialogContent>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <input id="cid" name="cid" value={id} type="hidden" />
              <SoftTypography variant="h3" component="h2" fontWeight="bold" mb={2}>
                Edit {name} Details
              </SoftTypography>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "1rem", width: "100%" }}>
                <SoftTypography variant="body1" component="label" htmlFor="company-name" mb={1} mr={1} width="120px" textAlign="right">
                  Package:
                </SoftTypography>
                <SoftInput
                  id="package"
                  value={billCompany}
                  onChange={(event) => setBillCompany(event.target.value)}
                  type="text"
                  placeholder="Company Name"
                  size="medium"
                  style={{ marginBottom: "0.5rem" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "1rem", width: "100%" }}>
                <SoftTypography variant="body1" component="label" htmlFor="address" mb={1} mr={1} width="120px" textAlign="right">
                  Address:
                </SoftTypography>
                <SoftInput
                  id="address"
                  value={caddress}
                  onChange={(event) => setCaddress(event.target.value)}
                  type="text"
                  placeholder="Address"
                  size="medium"
                  style={{ marginBottom: "0.5rem" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "1rem", width: "100%" }}>
                <SoftTypography variant="body1" component="label" htmlFor="phone-number" mb={1} mr={1} width="120px" textAlign="right">
                  Marks:
                </SoftTypography>
                <SoftInput
                  id="min_marks"
                  value={cminmarks}
                  onChange={(event) => setCminmarks(event.target.value)}
                  type="text"
                  placeholder="Min Marks"
                  size="medium"
                  style={{ marginBottom: "0.5rem" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "1rem", width: "100%" }}>
                <SoftTypography variant="body1" component="label" htmlFor="email" mb={1} mr={1} width="120px" textAlign="right">
                  Date:
                </SoftTypography>
                <SoftInput
                  id="date"
                  value={cdate}
                  onChange={(event) => setCdate(event.target.value)}
                  type="text"
                  placeholder="Date"
                  size="medium"
                  style={{ marginBottom: "0.5rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <SoftButton type="submit" circular={true} color="primary" variant="gradient" size="small" style={{ marginRight: "1rem" }}>
                  Save
                </SoftButton>
                <SoftButton onClick={handleCancel} type="button" circular={true} color="primary" variant="gradient" size="small">
                  Cancel
                </SoftButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>

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
  min_marks: PropTypes.string.isRequired,
  pbranch: PropTypes.string.isRequired
};

export default Bill;
