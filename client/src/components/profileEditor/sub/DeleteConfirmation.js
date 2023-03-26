import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function DeleteConfirmation(props) {
    const open = props.open
    const callback = props.callback
    const data = props.data
    const cancel = props.cancel

    return (
        <Dialog open={open} fullWidth maxWidth={"xs"}>
            <DialogTitle>Are you sure you want to delete {data.name}?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => cancel()} color="primary" disableElevation>cancel</Button>
                <Button onClick={() => callback(data.order)} color="primary" disableElevation>delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmation;