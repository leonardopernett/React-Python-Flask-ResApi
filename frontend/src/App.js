import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// component
import About from "./components/About";
import User from "./components/User";
import Navigation from "./components/Navigation";

//bootstrap
// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container p-2">
        <Switch>
          <Route path="/users" exact component={User} />
          <Route paht="/user/about" component={About} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
