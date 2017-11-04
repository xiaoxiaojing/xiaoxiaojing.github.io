import React, {Component} from 'react'
import SearchInput from './SearchInput'
import List from './List'
import SearchDecorator from './SearchDecorator'

@SearchDecorator
class Search extends Component {
    constructor () {
        super()
    }
    render () {
        const {
            value,
            onChange,
            items
        } = this.props
        return (
            <div style={{background: "#aaa", width:400, height:200, padding: 20}}>
                <SearchInput value={value} onChange={onChange}/>
                <List items={items} isOpen={true} onSelect={(item)=>{console.log(item);}}/>
            </div>
        )
    }
}

export default Search
