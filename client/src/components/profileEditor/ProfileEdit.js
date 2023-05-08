import { useState, useEffect } from 'react';

import { Dialog, DialogTitle, DialogContent, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Collapse, Avatar, IconButton, TextField, DialogActions } from '@mui/material';
import DeleteConfirmation from './sub/DeleteConfirmation';

import ProfileItem from './sub/ProfileItem';

import socket from '../../services/Socket';

function ProfileEdit(props) {

    const profileData = props.data;
    const closeCallback = props.closeCallback;
    const selectCallback = props.selectCallback;

    const [profileEditNum, setProfileEditNum] = useState(-1);
    const [data, setData] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState({});

    useEffect(() => {
        setData(profileData)
    }, [profileData])

    function toggleEdit(order) {
        if (order === profileEditNum) {
            setProfileEditNum(-1);
        } else {
            setProfileEditNum(order);
        }
    }

    function moveProfile(order, up) {
        var newData = [...data]
        if (up) {
            if (order === 1) return;

            let temp = newData[order - 1];
            newData[order - 1] = newData[order - 2];
            newData[order - 2] = temp;

            // update the order attribute of the two items
            newData[order - 1].order = order;
            newData[order - 2].order = order - 1;
            setProfileEditNum(order - 1)
        } else {
            if (order === data.length) return;

            let temp = newData[order - 1];
            newData[order - 1] = newData[order];
            newData[order] = temp;

            // update the order attribute of the two items
            newData[order - 1].order = order;
            newData[order].order = order + 1;
            setProfileEditNum(order + 1)
        }

        setData(newData);
    }

    function changeName(order, newName) {
        var newData = [...data]
        newData[order - 1].name = newName;
        setData(newData);
    }

    function confirmDelete(order) {
        setDataToDelete(data[order - 1])
        setDeleteConfirmationOpen(true);
    }

    function cancelDelete() {
        setDataToDelete({})
        setDeleteConfirmationOpen(false);
    }

    function deleteProfile(order) {
        setDeleteConfirmationOpen(false);

        var newData = [...data]
        newData.splice(order - 1, 1);
        for (let i = order - 1; i < newData.length; i++) {
            newData[i].order = i + 1;
        }
        setData(newData);
        selectCallback(newData[0].uuid)
    }

    function addProfile() {
        if (data.length === 9) return;

        function newProfileCallback(response) {
            var newData = [...data]
            response.order = newData.length + 1;
            newData.push(response);
            setData(newData)
        }

        socket.request({ "request": "create_profile" }, newProfileCallback)
    }

    function save() {
        function saveCallback(response) {
            closeCallback(data);
        }

        socket.request({ "request": "update_profiles", "args": { "payload": data } }, saveCallback)
    }

    return (
        <>
            <Dialog open={props.open} fullWidth maxWidth={"xs"}>
                <DeleteConfirmation open={deleteConfirmationOpen} cancel={cancelDelete} callback={deleteProfile} data={dataToDelete} />
                <DialogTitle>Collection profiles</DialogTitle>
                <DialogContent>
                    <List>

                        {data.map((item) => {
                            return (
                                <ProfileItem key={item.order} data={item} toggleEdit={toggleEdit} showProfileEdit={profileEditNum === item.order} move={moveProfile} changeName={changeName} confirmDelete={confirmDelete} canDelete={data.length !== 1} />
                            )
                        })}

                    </List>
                    <Button sx={{ width: "100%" }} disabled={data.length === 9} color="primary" variant="outlined" onClick={addProfile} disableElevation>add profile ({9 - data.length} left)</Button>
                </DialogContent>
                <DialogActions>
                    {/* <Button color="primary" disableElevation>cancel</Button> */}
                    <Button color="primary" onClick={save} disableElevation>done</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ProfileEdit;