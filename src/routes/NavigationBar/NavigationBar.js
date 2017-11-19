import React, { Component } from 'react'

import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../css/root.css'

class NavigationBar extends Component {
    render() {
        return(       
            <nav className="navbar pure-menu pure-menu-horizontal">
                <a href="#" className="pure-menu-heading pure-menu-link">Darticles</a>
            </nav>
        )
    }
};

export default NavigationBar;