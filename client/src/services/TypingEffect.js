import React, { useEffect, useState } from 'react';

function useTypingEffect(initialText) {
    const [targetText, setTargetText] = useState(initialText);
    const [outputText, setOutputText] = useState("");

    function trigger(){
        var output = "";
        for(let i = 0; i < targetText.length; i++){
            // eslint-disable-next-line no-loop-func
            setTimeout(() => {
                output += targetText[i];
                setOutputText(output);
            }, i * 40);
        }

        setTimeout(() => {
            for(let i = targetText.length; i > 0; i--){
                // eslint-disable-next-line no-loop-func
                setTimeout(() => {
                    output = output.slice(0,-1)
                    setOutputText(output);
                }, i * 50);
            }
        }, 5000)
    }

    return [outputText, setTargetText, trigger]
}

export { useTypingEffect };