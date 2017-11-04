import React, {Component} from 'react'

const pStyle = {
    borderBottom:"1px solid #ccc",
    margin: 0,
    height: 30,
    lineHeight: "30px"
}
const divStyle = {
    marginTop:1,
    background: "#fff",
    width: 200,
    height: 120,
    overflowY:'auto'
}

export default function SelectInput ({
    items,
    onSelect,
    isOpen
}) {
    return (
        <div style={{...divStyle, display: isOpen ? 'block' : 'none'}}>
            {
                items.map((item)=>{
                    return <p style={pStyle} key={item} onClick={()=>{
                        onSelect(item)
                    }}>{item}</p>
                })
            }
        </div>
    )
}
