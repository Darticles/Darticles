import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import Home from './routes/home';

ReactDOM.render(
  <BrowserRouter>
      <div>
          <Switch>
              <Route exact path="/" component={Home} />
          </Switch>
      </div>
  </BrowserRouter>,
  document.getElementById('root')
);