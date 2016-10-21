import React from "react";
import ReactDOM from "react-dom";

class Hello extends React.Component {
  render() {
    return <h1>Hello, react-min world!</h1>;
  }
}

ReactDOM.render(
  <Hello />,
  document.querySelector(".container")
);