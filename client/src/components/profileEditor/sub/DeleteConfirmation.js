import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function DeleteConfirmation(props) {
    return (
        <Dialog open={false} fullWidth maxWidth={"xs"}>
            <DialogTitle>Are you sure you want to delete [profile name]?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" disableElevation>cancel</Button>
                <Button color="primary" disableElevation>delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmation;