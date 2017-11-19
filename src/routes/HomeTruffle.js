import React, { Component } from 'react'
import classnames from 'classnames'

import SimpleStorageContract from '../../build/contracts/SimpleStorage.json'
import getWeb3 from '../utils/getWeb3'
import NavigationBar from './NavigationBar/NavigationBar'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import './css/root.css'

class App extends Component {  

    render() {
        return (
          <div className="App">
              <NavigationBar/>
              <main className="container">
                  <h1>Darticles</h1>
                  <h2>Decentralized artwork portfolio and auctioning platform.</h2>
              </main>
          </div>
        )
    }

}

export default App
