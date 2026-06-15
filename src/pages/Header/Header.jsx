import React from 'react'
import Header1 from './Header1'
import Header2 from './Header2'

const Header = ({ onSearch }) => {
    return (
        <div>
            <Header1 />
            <Header2 onSearch={onSearch} />
        </div>
    )
}

export default Header;