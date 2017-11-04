import React, {Component} from 'react'

const inputStyle = {
    width: 200,
    height: 30,
    marginTop: 10,
    outline: "none",
    border: 0
}

export default function SearchInput ({
    value,
    onChange,
    style
}) {
    const newStyle = style ? {
        ...inputStyle,
        ...style
    } : inputStyle
    return (
        <input style={newStyle} value={value} onChange={onChange}/>
    )
}
