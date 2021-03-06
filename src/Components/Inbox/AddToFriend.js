import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthService from '../../services/auth.service';
import Heading from '../Partials/Heading';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import $ from 'jquery';
import authHeader from "../../services/auth-header";
import swal from 'sweetalert';
const currencies = [
  {
    value: 'chores',
    label: 'chores',
  },
  {
    value: 'hobby',
    label: 'hobby',
  },
  {
    value: 'study',
    label: 'study',
  },
  {
    value: 'work',
    label: 'work',
  },
];
const colors = [
  {
    value: 'red',
    label: 'red',
  },
  {
    value: 'green',
    label: 'green',
  },
  {
    value: 'yellow',
    label: 'yellow',
  },
  {
    value: 'blue',
    label: 'blue',
  },
];
const AddToFriend = (props) => {
  const confirmBtm = {
    marginTop: '20px'
  }

  let [taskName, setTaskname] = useState("");
  let [userEmail, setUseremail] = useState("");
  let [taskDuration, setTaskduration] = useState("");
  let [taskType, setTasktype] = useState("");
  let [taskColor, setTaskcolor] = useState("");
  let [userId, setUserId] = useState("");
  let [friend, setFriend] = useState([]);

  const user = AuthService.getCurrentUser();
  const history = useHistory();
  useEffect(() => {
    AuthService.isAuthorized()
      .catch(() => {
        history.push("/");
      })
  }, [])
  const getUserByemail = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userEmail}`, { method: 'GET', headers: authHeader() })
      const result = await res.json();
      setUserId(userId = result._id);
      setFriend(friend = result);
    }
    catch (err) {
      setUserId(userId = "");
    }
  }
  const isValidEmail = async () => {
    await getUserByemail();
    if (!userId || userId === "")
      return false;
    return true;
  }
  const checkIsvalidFields = async () => {
    if (taskName.length > 35) {
      $('.formError').append("The name of the task should be less than 36 characters!");
    }
    else if (await isValidEmail() === false) {
      $(".formError").html("");
      $('.formError').append("Wrong Email!");
      return false;
    }
    else if (userId === user.id) {
      $(".formError").html("");
      $('.formError').append("This is your email, please add task with the Add Task Form!");
      return false;
    }
    else if (taskDuration < 0 || !parseFloat(taskDuration) || (((taskDuration % 1) * 100) % 25 !== 0)) {
      $(".formError").html("");
      $('.formError').append("The duration should be positive number and consistent every 15 minutes!");
      return false;
    }
    else if (taskName === "" || taskColor === "" || taskType === "" || taskDuration === 0 || userEmail === "") {
      $(".formError").html("");
      $('.formError').append("Please fill all the fields in the form!");
      return false;
    }
    return true;
  }
  const fileErrorTreatment = (err) => {
    $(".formError").html("");
    if (err === 500) {
      $(".formError").append("Error getting the data from db");
      swal("Note!", "Error getting the data from db", "error");
    }
  }
  const formValidation = async () => {
    $(".formError").html("");
    if (await checkIsvalidFields() === true) {
      try {
        const Body = {
          "name": taskName,
          "id": userId,
          "email": userEmail,
          "duration_time": parseFloat(taskDuration),
          "id_of_side_user": user.id,
          "name_of_side_user": user.username,
          "color": taskColor,
          "task_type": parseInt(friend.categories[taskType]),
          "category": taskType
        }

        $.ajax({
          type: "POST",
          url: `http://localhost:8080/api/inbox/`,
          data: Body,
          headers: authHeader(),
          success: (res) => {
            swal("Well Done!", "The Event was created successfully and sent to your friend!", "success");
          },
          error: (response) => {
            fileErrorTreatment(response.status);
          }
        });
      }
      catch (err) {
      }
    }

  }
  const styles = {
    container: {
      marginTop: '30px',
      backgroundColor: '#fff',
      boxShadow: ' 2px 2px 2px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      borderRadius: '10px',
      minHeight: '71vh',
      overflow: 'hidden',
    },
    formErr: {
      color: "red"
    }
  }
  return (
    <div className="container" style={styles.container}>
      <Heading heading='Add to friend Form' />
      <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
        <div>
          <TextField required className="forminput"
            id="outlined-required"
            autoComplete="Disabled"
            label="Required task name"
            onChange={e => { setTaskname(taskName = e.target.value); }}
          />
        </div>
        <div>
          <TextField required className="forminput"
            id="outlined-required"
            label="Required user's email"
            defaultValue=""
            autoComplete="Disabled"
            onChange={e => { setUseremail(userEmail = e.target.value); }}
          />
        </div>
        <div>
          <TextField required inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            id="outlined-required"
            label="Required duration (0.25 = 1/4 hour )"
            defaultValue="0"
            onChange={e => { setTaskduration(taskDuration = e.target.value); }}
          />
        </div>
        <div>
          <TextField
            id="outlined-select-currency outlined-required"
            select
            label="Select the task category"
            defaultValue=""
            onChange={e => { setTasktype(taskType = e.target.value); }}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <TextField
            id="outlined-select-currency outlined-required"
            select
            label="Select a color"
            defaultValue=""
            onChange={e => { setTaskcolor(taskColor = e.target.value); }}
          >
            {colors.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Button style={confirmBtm} component="submit" name="submit" variant="contained" onClick={formValidation}>confirm</Button>
        <p className="formError" style={styles.formErr}></p>
      </Box>

    </div>
  );
};

export default AddToFriend;
