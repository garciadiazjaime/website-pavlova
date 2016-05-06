import React from 'react';
import { IndexRoute, Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import sitemap from '../sitemap';
const { items } = sitemap;
const routes = items.children.map((item, index) => {
  return (<Route path={item.url} component={item.component} key={index} />);
});
const history = process.env.TIER === 'FE' ? createBrowserHistory() : null;


export default(
  <Router history={history}>
    <Route path="/" component={items.component}>
      <IndexRoute component={items.default} />
      {routes}
    </Route>
  </Router>
);
