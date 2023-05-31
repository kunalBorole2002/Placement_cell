import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from 'axios';
import DeleteIcon from "@material-ui/icons/Delete";
import { Grid, Dialog, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import SoftInput from "components/SoftInput";
import {IconButton} from "@mui/material";

function Bill({ id, name, company, email, vat, noGutter, minmarks, studentmarks, cpbranch, studentbr }) {
  const [addQuestionMode, setAddQuestionMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const companyId = id;
  const companyName = name;
  const [questions, setQuestions] = useState([]);
  const [eligible, setEligible] = useState("loading"); // set the initial state to "loading" instead of "Eligible"
  const [applied, setApplied] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [openPopup, setOpenPopup] = useState(false);

  const handleDeleteQuestion = async (companyId, questionId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/deletequestions/${companyId}/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      setOpenPopup(false);
      setMessage("Your question is deleted successfully");
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };


  const [showQuestions, setShowQuestions] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");

  const handleAddQuestion = () => {
    setShowQuestions(false);
  };

  const useStyles = makeStyles({
    paper: {
      borderRadius: '18px',
    },
  });

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/insertquestions', {studentName, companyId, question: newQuestion });
      setNewQuestion("");
      setShowQuestions(true);
      setOpenPopup(false);
      setMessage("New Question added successfully");
      setOpen(true);
    } catch (err) {
      console.error(err);
      setOpenPopup(false);
      setMessage("Error while inserting new question");
      setOpen(true);
    }
  };
  const handleCancel = async () =>{
    setShowQuestions(true);
    setOpenPopup(false);
    setMessage("Cancelled");
    setOpen(true);
  }

  const handleQuestion = async (companyId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/questions/${companyId}`);
      if(response.data.questions){
        setQuestions(response.data.questions);
        setOpenPopup(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApply = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/api/applied", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentid: studentId,
          studentname: studentName,
          companyid: companyId,
          companyname: companyName,
          status: "applied",
        }),
      });

      const data = await response.json();

      setMessage(`You have successfully applied for the ${companyName}`);
      setOpen(true);

      setApplied(true); // update the state variable
      setEligible("Applied"); // update the state variable

    } catch (error) {
      console.error(error);
    }
  }, [companyId, companyName, studentId, studentName]);

  useEffect(() => {
    async function fetchLoggedInUser() {
      const response = await fetch('http://localhost:3001/api/loggedin');
      const data = await response.json();
      setStudentId(data.studentid);
      setStudentName(data.studentname);
    }

    fetchLoggedInUser();
  }, []);

  if (studentId && companyId) {
    const fetchAppliedStatus = debounce(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/getapplied/${studentId}/${companyId}`);
        const isApplied = await response.json();
        setApplied(isApplied);
      } catch (error) {
        console.error(error);
      }
    }, 500);
    fetchAppliedStatus();
  }

  useEffect(() => {
    async function fetchUserType() {
      const isNotEligible = applied === false && (Number(studentmarks) < Number(minmarks) || !cpbranch.includes(studentbr));
      if (applied === true) {
        setEligible('Applied');
      } else if (isNotEligible) {
        setEligible('Not Eligible');
      } else if (applied === false) {
        setEligible('Eligible');
      }
    }
    fetchUserType();
  }, [minmarks, applied]);

  const classes = useStyles();

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
            <SoftTypography
                variant="button"
                fontWeight="medium"
                textTransform="capitalize"
            >
              {name}
            </SoftTypography>

            <SoftTypography
                variant="body1"
                color={eligible === "Eligible" ? "success" : eligible === "Applied" ? "primary" : "error"}
                fontWeight="bold"
                textGradient="true"
            >
              {eligible}
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Package :&nbsp;&nbsp;&nbsp;
              <SoftTypography
                  variant="caption"
                  fontWeight="medium"
                  textTransform="capitalize"
              >
                {company}
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
          <SoftBox mb={1} lineHeight={0}>
            <SoftTypography variant="caption" color="text">
              Company Address:&nbsp;&nbsp;&nbsp;
              <SoftTypography variant="caption" fontWeight="medium">
                {email}
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
          <SoftTypography variant="caption" color="text">
            Date:&nbsp;&nbsp;&nbsp;
            <SoftTypography variant="caption" fontWeight="medium">
              {vat}
            </SoftTypography>
          </SoftTypography>
          {eligible === "Eligible" && (
              <SoftBox display="flex" flexDirection="column" alignItems="center" mt={2}>
                <SoftButton circular={true}  color="primary" variant="gradient" onClick={handleApply}>
                  Apply
                </SoftButton>
              </SoftBox>
          )}
          {eligible === "Applied" && (
              <SoftBox display="flex" flexDirection="column" alignItems="center" mt={2}>
                <SoftButton color="primary" circular={true} variant="gradient" onClick={() => handleQuestion(companyId)}>
                  Questions
                </SoftButton>
              </SoftBox>
          )}
        </SoftBox>
        <SoftBox>
          {questions.length > 0 && (
              <SoftTypography variant="body1" mt={2}>
                {questions[0].question}
              </SoftTypography>
          )}
        </SoftBox>
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

        <Dialog classes={{ paper: classes.paper }}  open={openPopup} onClose={() => setOpenPopup(false)} scroll="paper" fullWidth={true}>
          <DialogContent>
            {showQuestions ? (
                questions.length > 0 ? (
                    <ol style={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
                      <SoftButton
                          color="primary"
                          variant="gradient"
                          size="small"
                          circular={true}
                          style={{ position: "absolute", top: 15, right: 15 }}
                          onClick={handleAddQuestion}
                      >
                        Add Question
                      </SoftButton>
                      <SoftTypography variant="h3" component="h2" fontWeight="bold" mb={2}>
                        {name}
                      </SoftTypography>
                      <SoftTypography variant="body1" component="h1" fontWeight="bold" mb={1}>
                        Questions:
                      </SoftTypography>

                      {questions.map((question, index) => (
                          <SoftBox
                              key={index}
                              variant="contained"
                              bgColor="#f5f5f5"
                              p={2}
                              my={1}
                              borderRadius="14px"
                              shadow="0 2px 4px rgba(0, 0, 0, 0.2)"
                              style={{ display: "flex", justifyContent: "space-between" }}
                          >
                            <SoftTypography variant="body2" component="p" mb={1}>
                              {question}
                            </SoftTypography>
                            <SoftBox>
                              {question.includes(studentName) && (
                                  <IconButton
                                      aria-label="delete"
                                      size="small"
                                      onClick={() => handleDeleteQuestion(companyId, index)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                              )}
                            </SoftBox>
                          </SoftBox>
                      ))}
                    </ol>
                ) : (
                    <div>
                      <SoftButton
                          color="primary"
                          variant="gradient"
                          size="small"
                          circular={true}
                          style={{ position: "absolute", top: 15, right: 15 }}
                          onClick={handleAddQuestion}
                      >
                        Add Question
                      </SoftButton>
                      <SoftTypography variant="body1">No questions found</SoftTypography>
                    </div>

                )
            ) : (
                <form onSubmit={handleQuestionSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <SoftTypography variant="h3" component="h2" fontWeight="bold" mb={2}>
                    {name}
                  </SoftTypography>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
                    <SoftTypography variant="body1" component="h1" fontWeight="bold" mb={1}>
                      Add Question:
                    </SoftTypography>
                    <SoftInput
                        type="text"
                        placeholder="Enter your question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        size="medium"
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                    <input type="hidden" value={companyId}/>
                    <SoftButton type="submit" circular={true} color="primary" variant="gradient" size="small" style={{ marginRight: "1rem" }}>
                      Submit
                    </SoftButton>
                    <SoftButton type="button" onClick={handleCancel} circular={true} color="primary" variant="gradient" size="small">
                      Cancel
                    </SoftButton>
                  </div>
                </form>
            )}
          </DialogContent>
        </Dialog>

      </SoftBox>
  );
}

Bill.defaultProps = {
  noGutter: false,
};

Bill.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  company: PropTypes.string,
  email: PropTypes.string,
  vat: PropTypes.string,
  noGutter: PropTypes.bool,
  minmarks: PropTypes.string,
  studentmarks: PropTypes.string,
  cpbranch: PropTypes.string,
  studentbr: PropTypes.string
};

export default Bill;
