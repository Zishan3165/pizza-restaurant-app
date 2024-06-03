import React, { Component } from "react";
import DropdownAlert from "react-native-dropdownalert";
import { Text, View, StyleSheet } from "react-native";
import { List_Order_History } from "./../Database";
import { graphql, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";
import Context from "./../store/context";
import { Dimensions } from "react-native";
import OrderHistoryRow from "./OrderHistoryRow";
const { height } = Dimensions.get("window");

class OrderHistory extends Component {
  state = {
    orderList: [],
  };

  componentDidMount() {
    this.context.resetCart();
    this.fetchOrderList();
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  fetchOrderList = async () => {
    try {
      const { user } = this.context;

      const query = await this.props.client.query({
        query: List_Order_History,
        variables: {
          condition: {
            userId: user.rowId,
          },
        },
      });
      const { nodes } = query?.data?.allOrders;
      if (nodes && nodes.length > 0) {
        this.setState({ orderList: nodes });
      } else {
        this.setState({ orderList: [] });
      }
    } catch (err) {
      console.log("error : ", err);
      this.setState({ orderList: [] });
    }
  };

  reorder = (orders) => {
    const { addAllToCart } = this.context;
    const { navigation } = this.props;
    orders = orders.filter((item) => !item?.isDeal);
    if (orders.length === 0) {
      return this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Cannot reorder deals"
      );
    }
    addAllToCart(orders);
    navigation.navigate("ViewOrder");
  };

  render() {
    const { orderList } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleTextStyle}>Order History</Text>
        </View>
        <View
          style={{
            overflowY: "auto",
            height: height * 0.7,
            marginBottom: 20,
            width: "100%",
          }}
        >
          {orderList.map((item) => (
            <OrderHistoryRow
              reorder={this.reorder}
              navigation={this.props.navigation}
              row={item}
            />
          ))}
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  eorderListTitleStyle: {
    fontSize: 18,
    alignItems: "left",
    fontWeight: "bold",
    justifyContent: "left",
    paddingBottom: 20,
    marginTop: 20,
  },
  priceInputStyle: {
    width: "25%",
    backgroundColor: "rgba(58, 158, 152, 0.29)",
    marginTop: 10,
    padding: 8,
    color: "black",
    borderRadius: 14,
    fontSize: 18,
    marginTop: "auto",
    marginBottom: "auto",
  },
  textArea: {
    width: "80%",
    backgroundColor: "rgba(58, 158, 152, 0.29)",
    marginTop: 10,
    padding: 8,
    color: "black",
    borderRadius: 14,
    fontSize: 18,
    marginBottom: 5,
  },
  switchStyle: {
    borderRadius: 20,
    backgroundColor: "#3A9E98",
    width: 70,
    height: 36,
  },
  input: {
    width: "80%",
    height: 55,
    backgroundColor: "rgba(58, 158, 152, 0.29)",
    marginTop: 10,
    padding: 8,
    color: "black",
    borderRadius: 14,
    fontSize: 18,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    padding: 20,
  },
  titleTextStyle: {
    fontSize: 18,
    alignItems: "center",
    fontWeight: "bold",
    justifyContent: "center",
    paddingBottom: 20,
  },
  signUpButtonStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#394F51",
    paddingBottom: 10,
    paddingTop: 10,
    height: 40,
    width: 200,
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  spaceBetweenButton: {
    width: 20,
    height: 20,
  },
  registerCodeStyle: {
    marginTop: 20,
  },
  verifyButtonStyle: {
    textAlign: "center",
    backgroundColor: "#394F51",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: "5px",
    height: 30,
    margin: "auto",
  },
});

OrderHistory.contextType = Context;
export default compose(
  withApollo,
  graphql(List_Order_History, { name: "List_Order_History" })
)(OrderHistory);
