import React, {Component} from 'react'
import SelectInput from './SelectInput'
import SearchInput from './SearchInput'
import List from './List'
import SearchDecorator from './SearchDecorator'
import SelectDecorator from './SelectDecorator'

@SelectDecorator
@SearchDecorator
export default class SearchSelect extends Component {
    constructor () {
        super ()
    }
    render () {
        const {
            value,
            onChange,
            items,
            selectItem,
            onClick,
            onSelect,
            isOpen
        } = this.props

        return (
            <div style={{background: "#aaa", width:400, height:200, padding: 20}}>
                <SelectInput selectItem={selectItem} onClick={onClick}/>
                <SearchInput value={value} onChange={onChange} style={{display: isOpen ? 'block' : 'none'}}/>
                <List items={items} isOpen={isOpen} onSelect={onSelect}/>
            </div>
        )
    }
}
