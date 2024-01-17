import React, { useEffect, useState } from 'react'

const type = {
    "pending": "opacity-50 cursor-not-allowed disabled",
    "active": "hover:bg-gray-200",
}

function CustomButton({ role = 'active', text, handleFunction, loading = false, bgColor = 'bg-gray-100' }) {
    const [buttonType, setButtonType] = useState(type.active)
    const [buttonDisabled, setDisabled] = useState(false)

    useEffect(() => {
        if (loading) {
            setButtonType(type.pending)
            setDisabled(true)
        } else {
            setButtonType(type.active)
            setDisabled(false)
        }
    }, [loading])

    return (
        <>
            <button className={`bg-gray-100 px-6 py-1 rounded-lg ${buttonType}`} disabled={buttonDisabled} onClick={() => {
                handleFunction()
            }} >{text} </button>
        </>
    )
}

export default CustomButton