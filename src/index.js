import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import Home from './routes/HomeTruffle';
import Uploader from './routes/upload';
import AuctionHome from './routes/Auction/HomeAuction';

ReactDOM.render(
  <BrowserRouter>
      <div>
          <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/upload" component={Uploader}/>
              <Route path="/auctions" component={AuctionHome}/>
          </Switch>
      </div>
  </BrowserRouter>,
  document.getElementById('root')
);