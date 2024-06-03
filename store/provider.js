import React, { Component } from "react";
import MyContext from "./context";

class MyProvider extends Component {
  state = {
    user: {},
    pizza: {},
    cart: [],
  };

  render() {
    return (
      <MyContext.Provider
        value={{
          user: this.state.user,
          cart: this.state.cart,
          addToCart: (item) => {
            this.setState({
              cart: [...this.state.cart, item],
            });
          },
          addAllToCart: (items) => {
            this.setState({
              cart: items,
            });
          },
          resetCart: () => {
            this.setState({
              cart: [],
            });
          },
          saveUser: (user) => {
            this.setState({
              user,
            });
          },
          saveUserSignup: (signUpUser) => {
            this.setState({
              signUpUser,
            });
          },
          deleteUser: () => {
            this.setState({
              user: {},
            });
          },
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
