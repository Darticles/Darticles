import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import Home from './routes/home';
import Uploader from './routes/upload';

ReactDOM.render(
  <BrowserRouter>
      <div>
          <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/upload" component={Uploader}/>
          </Switch>
      </div>
  </BrowserRouter>,
  document.getElementById('root')
);