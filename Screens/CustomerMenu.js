import React, { Component } from "react";
import Context from "./../store/context";
import { downArrowMenu, viewOrderIcon } from "../constants/icons";
import DropdownAlert from "react-native-dropdownalert";
import { avatar_4 } from "../constants/images";
import { Dimensions } from "react-native";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import PizzaRowCustomer from "./PizzaRowCustomer";
import { List_Current_Food_Items, List_Deals } from "./../Database";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { withApollo } from "react-apollo";
import UserModal from "../components/UserMenuModal";
import ConfirmModal from "../components/ConfirmModal";

const { height } = Dimensions.get("window");

class CustomerMenu extends Component {
  state = {
    itemList: [],
    showModal: false,
    showModalOrder: false,
    showOrderConfirm: false,
  };

  componentDidMount = () => {
    this.fetchPizzaList();
  };

  onOk = () => {
    this.setShowModalOrder(false);
  };

  setShowModal = (showModal) => {
    this.setState({ showModal });
  };

  setShowModalOrder = (showModalOrder) => {
    this.setState({ showModalOrder });
  };

  handleLogout = () => {
    this.context.saveUser({});
    this.setShowModal(false);
    this.context.resetCart();
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "OnboardPage" }],
    });
  };

  viewOrder = () => {
    const { cart } = this.context;
    if (cart.length === 0) {
      return this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Order is empty!"
      );
    }
    this.props.navigation.navigate("ViewOrder");
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props?.route?.params?.order &&
      this.props?.route?.params?.order !== prevProps?.route?.params?.order
    ) {
      setTimeout(this.setShowModalOrder(true), 600000);
    }
  }

  fetchPizzaList = async () => {
    let itemList = [];
    let query = await this.props.client.query({
      query: List_Deals,
      variables: {
        condition: {
          isValid: true,
        },
      },
    });
    let { nodes } = query?.data?.allDeals;
    if (nodes && nodes.length > 0) {
      itemList = [...nodes];
    }
    query = await this.props.client.query({
      query: List_Current_Food_Items,
      variables: {
        condition: {
          isActive: true,
        },
      },
    });
    nodes = query?.data?.allPizzas.nodes;
    if (nodes.length > 0) {
      itemList = [...itemList, ...nodes];
    }
    this.setState({ itemList });
  };

  fetchDealList = async () => {
    try {
      const query = await this.props.client.query({
        query: List_Deals,
        variables: {
          condition: {
            isValid: true,
          },
        },
      });
      const { nodes } = query?.data?.allDeals;
      if (nodes && nodes.length > 0) {
        this.setState({ dealList: nodes });
      } else {
        this.setState({ dealList: [] });
      }
    } catch (err) {
      console.log("error : ", err);
      this.setState({ dealList: [] });
    }
  };

  render() {
    const { user, cart } = this.context;
    const { itemList, showModal, showModalOrder } = this.state;
    return (
      <View style={{ padding: "1rem" }}>
        {showModal && (
          <UserModal
            onLogout={this.handleLogout}
            onSetShowModal={this.setShowModal}
          />
        )}
        {showModalOrder && (
          <ConfirmModal
            onOk={this.onOk}
            message={"No more wait, your delicious pizza is ready to pick up"}
          />
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18, fontWeight: 700 }}>MENU</Text>
            <Image
              source={downArrowMenu}
              style={{
                width: 16,
                height: 14,
                margin: 5,
                marginLeft: 10,
              }}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setShowModal(true)}>
              <Image
                onPress={() => this.setShowModal(true)}
                source={avatar_4}
                style={{
                  width: 50,
                  height: 50,
                  margin: "auto",
                  borderRadius: 100 / 2,
                }}
              />
              <Text style={{ fontSize: 14, fontWeight: 400 }}>
                {user?.userName}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{ overflow: "scroll", height: height * 0.6, marginBottom: 20 }}
        >
          {itemList.map((item) => (
            <PizzaRowCustomer row={item} navigation={this.props.navigation} />
          ))}
        </View>
        <View></View>
        <View style={{ margin: "auto", marginBottom: 10 }}>
          <View style={styles.menuButtonStyle}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
              }}
              onPress={() => this.viewOrder()}
            >
              <View style={styles.imageContainerView}>
                <Image
                  source={viewOrderIcon}
                  style={{
                    width: 20,
                    height: 20,
                    margin: 5,
                  }}
                />
              </View>
              <View>
                {" "}
                <Text style={styles.buttonTextStyle}>
                  View Order ({cart.length})
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.menuButtonStyle}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
              }}
              onPress={() => this.props.navigation.navigate("BuyGiftCard")}
            >
              <View>
                {" "}
                <Text style={styles.buttonTextStyle}>Buy Gift Cards</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.menuButtonStyle}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
              }}
              onPress={() => this.props.navigation.navigate("OrderHistory")}
            >
              <View>
                {" "}
                <Text style={styles.buttonTextStyle}>My Order History</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: "#4db6ac",
    margin: 10,
    padding: 8,
    color: "white",
    borderRadius: 14,
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleTextStyle: {
    fontSize: 18,
    alignItems: "center",
    fontWeight: "bold",
    justifyContent: "center",
    paddingBottom: 20,
  },
  menuButtonStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#394F51",
    paddingBottom: 10,
    paddingTop: 10,
    height: 40,
    width: 200,
    margin: 5,
    flexDirection: "row",
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
    margin: "auto",
    marginLeft: 10,
  },
  spaceBetweenButton: {
    width: 20,
    height: 20,
  },
  registerCodeStyle: {
    marginTop: 20,
  },
});

CustomerMenu.contextType = Context;
export default compose(
  withApollo,
  graphql(List_Current_Food_Items, { name: "List_Current_Food_Items" }),
  graphql(List_Deals, { name: "List_Deals" })
)(CustomerMenu);
