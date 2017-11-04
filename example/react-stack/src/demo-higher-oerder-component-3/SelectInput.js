import React, {Component} from 'react'

const inputStyle = {
    width: 200,
    height: 30,
    marginTop: 10
}

export default function SelectInput ({
    selectItem,
    onClick
}) {
    return (
        <input style={inputStyle} value={selectItem} onClick={onClick} readOnly/>
    )
}
