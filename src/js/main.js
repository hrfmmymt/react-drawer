import React from "react";
import ReactDOM from "react-dom";

class DrawerMenu extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    children: React.PropTypes.node,
    visible: React.PropTypes.bool
  };

  componentDidUpdate(prevProps) {
    if(!prevProps.visible && this.props.visible) {
      setTimeout(() => this.refs.menu.focus(), 350);
    }
  }

  render() {
    const {id, visible} = this.props;

    return(
      <div ref="menu" id={id} role="navigation" className="menu" aria-hidden={visible ? false : true} tabIndex="0">
        {this.props.children}
      </div>
    );
  }
}

class Container extends React.Component {

  state = {
    visible: false
  };

  onClick(index) {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    const { visible } = this.state;

    return (
      <div>
        <button
          onClick={this.onClick.bind(this)}
          aria-controls="navigation"
          aria-expanded={visible ? true : false}>
          {visible ? "Hide menu" : "Show menu"}
        </button>
        <DrawerMenu id="navigation" visible={visible}>
          <ul>
            <li><a href="#menu1">menu1</a></li>
            <li><a href="#menu2">menu2</a></li>
            <li><a href="#menu3">menu3</a></li>
          </ul>
        </DrawerMenu>
      </div>
    );
  }
}

ReactDOM.render(
  <Container />,
  document.querySelector(".container")
);
