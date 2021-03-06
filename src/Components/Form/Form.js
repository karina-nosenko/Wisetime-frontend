import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import $ from 'jquery';
import MenuItem from '@mui/material/MenuItem';
import AuthService from '../../services/auth.service';
import Button from '@mui/material/Button';
import authHeader from "../../services/auth-header";
import swal from 'sweetalert';

const user = AuthService.getCurrentUser();

const confirmBtm = {
    marginTop:'20px'
}

const categories = [
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

const AddTask = (props) => {
    let [taskName, setTaskname] = useState("");
    let [taskDuration, setTaskduration] = useState("");
    let [taskType, setTasktype] = useState("");
    let [taskColor, setTaskcolor] = useState("");
    let [userCategory, setUsercategory] = useState(0.25);
    const history = useHistory();

    const formErr = {
        color: "red"
    }

    const fileErrorTreatment = (res) => {
        const err = res.status
        $(".formError").html("");
        if (err === 409) {
            $(".formError").append(`There were hours left that were not entered into the system due to the constraints and categories!`);
            swal("Note!", `${res.responseJSON} due to the constraints, categories, and schedule frictions` , "warning");
        }
        if (err === 500) {
            $(".formError").html("Error getting the data from db");
            swal("Note!", "Error getting the data from db", "error");
        }
    }

    const getUsercategory = async (taskT) => {
        const res = await fetch(`http://localhost:8080/api/users/${user.id}/categories`, { method: 'GET', headers: authHeader() })
        const result = await res.json()
        setUsercategory(userCategory = result[taskT]);
    }

    const formValidation = async () => {
        getUsercategory(taskType).then(() => {
            if(taskName.length>35){        
                $('.formError').html("The name of the task should be less than 36 characters!");
            }
            else if (taskDuration < 0 || !parseFloat(taskDuration) || (((taskDuration % 1) * 100) % 25 !== 0)) {
                $('.formError').html("The duration should be positive number and consistent every 15 minutes!");
            }
            else if (taskName === "" || taskColor === "" || taskType === "" || taskDuration === 0) {
                $('.formError').html("Please fill all the fields in the form!");
            }
            else {
                const newTask = {
                    'name': taskName,
                    'color': taskColor,
                    'category': userCategory,
                    'dauration': parseFloat(taskDuration),
                    'categoryName': taskType
                }

                $.ajax({
                    type: "POST",
                    url: `http://localhost:8080/api/users/${user.id}/tasks`,
                    data: newTask,
                    headers: authHeader(),
                    success: (res) => {
                        swal("Good luck!", "The Event was created successfully!", "success");
                        history.push("/schedule");
                    },
                    error: (response) => {
                        fileErrorTreatment(response);
                    }
                });
            }
        })
    }

    return (
        <>
            <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
                <div>
                    <TextField required className="forminput"
                        id="outlined-required"
                        label="Required task name"
                        defaultValue=""
                        onChange={e => { setTaskname(taskName = e.target.value);}}
                    />
                </div>
                <div>
                    <TextField required inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        id="outlined-required"
                        label="Required duration (0.25 = 1/4 hour )"
                        defaultValue="0"
                        onChange={e => { setTaskduration(taskDuration = e.target.value);}}
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
                        {categories.map((option) => (
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
                        label="Please select a color"
                        defaultValue=""
                        onChange={e => { setTaskcolor(taskColor = e.target.value);}}
                    >
                        {colors.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <Button style={confirmBtm} component="submit" name="submit" variant="contained" onClick={formValidation}>confirm</Button>
                <p className="formError" style={formErr}></p>
            </Box>
        </>
    );
};

export default AddTask;
