import React, { Component } from 'react'
import { Navbar, NavItem } from 'react-materialize'

class NavigationBar extends Component {
    render() {
        return(       
            <Navbar className="blue darken-4" brand='Darticles' left>
                <NavItem className={this.props.location.pathname.includes("portfolio") ? "active" : ""} href='/portfolio'>Portfolio</NavItem>
                <NavItem className={this.props.location.pathname.includes("auctions") ? "active" : ""} href='/auctions'>Auctions</NavItem>
                <NavItem className={this.props.location.pathname.includes("profile") ? "active" : ""}href='/profile'>Profile</NavItem>
                <NavItem className={this.props.location.pathname.includes("balance") ? "active" : ""}href='/balance'>Balance</NavItem>
            </Navbar>
            // <nav className="navbar pure-menu pure-menu-horizontal">
            //     <a href="/" className="pure-menu-heading pure-menu-link">Darticles</a>
            //     <a href="/portfolio" className="pure-menu-heading pure-menu-link">Portfolio</a>
            //     <a href="/auctions" className="pure-menu-heading pure-menu-link">Auctions</a>
            //     <a href="/profile" className="pure-menu-heading pure-menu-link">Profile</a>
            // </nav>
        )
    }
};

export default NavigationBar;