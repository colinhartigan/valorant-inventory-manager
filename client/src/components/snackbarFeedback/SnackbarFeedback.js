import { useEffect, useState } from "react";

import { Alert, Snackbar } from "@mui/material";

function SnackbarFeedback(props) {

    const trigger = props.trigger;
    const setTrigger = props.setTrigger;
    const text = props.text;
    const type = props.type

    const [open, setOpen] = useState(false);

    function close(event, reason) {
        setOpen(false);
    }

    useEffect(() => {
        if (trigger) {
            setOpen(true);
            setTrigger(false);
        }
    }, [trigger])

    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={close} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
            <Alert severity={type} sx={{ width: '100%' }}>
                {text}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarFeedback;