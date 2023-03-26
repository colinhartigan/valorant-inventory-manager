import { useState, useEffect } from 'react';
import useEventListener from '@use-it/event-listener'

export default function useKeyboardListener() {
    const [keysDown, setKeysDown] = useState([])
    const [enabled, setEnabled] = useState(true)

    useEventListener("keydown", ({ key }) => {
        if (enabled) {
            var k = String(key)
            if (!keysDown.includes(k)) {
                setKeysDown([...keysDown, k])
            }
        }
    })
    useEventListener("keyup", ({ key }) => {
        if (enabled) {
            var k = String(key)
            setKeysDown(keysDown.filter(k2 => k2 !== k))
        }
    })

    function checkInput(e) {
        // checks if the currently focused element is a text input, if so, disable the listener
        var target = e.target
        if (target.tagName !== null && target.tagName !== undefined) {
            var targetTagName = target.tagName.toLowerCase();
            if (targetTagName === 'input') {
                setEnabled(false)
            } else {
                setEnabled(true)
            }
        }

    }

    useEffect(() => {
        const handleActivityFalse = () => {
            setKeysDown([])
        };

        const handleActivityTrue = () => {
            setKeysDown([])
        };

        window.addEventListener('focus', handleActivityTrue);
        window.addEventListener('blur', handleActivityFalse);
        window.addEventListener('focus', checkInput, true);

        return () => {
            window.removeEventListener('focus', handleActivityTrue);
            window.removeEventListener('blur', handleActivityFalse);
            window.removeEventListener('focus', checkInput, true);
        };
    }, []);

    return [keysDown];
} 