import React, {Component} from 'react'
import classnames from 'classnames'

import NavigationBar from './NavigationBar/NavigationBar'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import './css/root.css'

class App extends Component {
    constructor(props){
        super(props)
    }

    render() {
        const { className, ...props } = this.props;
        return(
        <div className="App">
        <NavigationBar/>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>UPLOADER</h1>
            </div>
          </div>
        </main>
      </div>
        );
    }
}

export default App;