import { useState, useEffect } from 'react';
import useEventListener from '@use-it/event-listener'

export default function useKeyboardListener() {
    const [keysDown, setKeysDown] = useState([])

    useEventListener("keydown", ({ key }) => {
        var k = String(key)
        if(!keysDown.includes(k)){
            setKeysDown([...keysDown, k])
        }
    })
    useEventListener("keyup", ({ key }) => {
        var k = String(key)
        setKeysDown(keysDown.filter(k2 => k2 !== k))
    })

    return [keysDown];
} 