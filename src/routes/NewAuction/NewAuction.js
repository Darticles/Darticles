import React, { Component } from 'react'
import NavigationBar from '../../routes/NavigationBar/NavigationBar'

export default class NewAuction extends Component {

    render() {
        return (
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <h1>This works</h1>
                </main>
            </div>
        )
    }

}
