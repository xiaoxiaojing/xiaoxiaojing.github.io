import React, {Component} from 'react'
import SelectInput from './SelectInput'
import List from './List'
import SelectDecorator from './SelectDecorator'

@SelectDecorator
class Select extends Component {
    constructor () {
        super()
    }
    render () {
        const {
            selectItem,
            onClick,
            onSelect,
            items,
            isOpen
        } = this.props
        return (
            <div style={{background: "#aaa", width:400, height:200, padding: 20}}>
                <SelectInput selectItem={selectItem} onClick={onClick}/>
                <List items={items} isOpen={isOpen} onSelect={onSelect}/>
            </div>
        )
    }
}

export default Select
