import React, { Component } from 'react'

import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../css/root.css'

class NavigationBar extends Component {
    render() {
        return(       
            <nav className="navbar pure-menu pure-menu-horizontal">
                <a href="/" className="pure-menu-heading pure-menu-link">Darticles</a>
                <a href="/portfolio" className="pure-menu-heading pure-menu-link">Portfolio</a>
                <a href="/auctions" className="pure-menu-heading pure-menu-link">Auctions</a>
                <a href="/profile" className="pure-menu-heading pure-menu-link">Profile</a>
            </nav>
        )
    }
};

export default NavigationBar;