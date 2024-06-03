import React, { Component } from "react";
import Context from "./../store/context";
import DropdownAlert from "react-native-dropdownalert";
import { Dimensions } from "react-native";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import {
  List_Current_Food_Items,
  List_Deals,
  List_Recent_Stored_User_Addresses,
  Create_User_Address,
  List_Gift_Cards,
  List_Ecoupons,
  Create_New_Order_Item,
  Create_New_Order,
  Use_Gift_Card,
} from "./../Database";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { withApollo } from "react-apollo";
import ViewOrderRow from "./ViewOrderRow";
import { orderIcon } from "./../constants/icons";
import EcouponRow from "./EcouponRow";
import PurchasedGiftCardRow from "./PurchasedGiftCardRow";
import ConfirmModal from "./ConfirmModal";
const { height } = Dimensions.get("window");

class ViewOrder extends Component {
  state = {
    itemList: [],
    showModal: false,
    addressLine1: "",
    addressLine2: "",
    isEcoupon: false,
    isGiftCard: false,
    zeroPrice: false,
    couponList: [],
    giftCardList: [],
    showModal: false,
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  componentDidMount() {
    this.fetchCouponList();
    this.fetchGiftCardList();
    this.calculateTotalPrice();
  }

  calculateTotalPrice = () => {
    const { cart } = this.context;
    let totalPrice = 0;
    cart.forEach((item) => (totalPrice = totalPrice + Number(item.pizzaPrice)));
    this.setState({ totalPrice });
  };

  fetchCouponList = async () => {
    try {
      const query = await this.props.client.query({
        query: List_Ecoupons,
        variables: {
          timestamp: new Date().toISOString(),
        },
      });
      const { nodes } = query?.data?.searchEcoupons;
      if (nodes && nodes.length > 0) {
        this.setState({ couponList: nodes });
      } else {
        this.setState({ couponList: [] });
      }
    } catch (err) {
      console.log("error : ", err);
      this.setState({ couponList: [] });
    }
  };

  fetchGiftCardList = async () => {
    try {
      const { user } = this.context;
      const query = await this.props.client.query({
        query: List_Gift_Cards,
        variables: {
          userId: user.rowId,
        },
      });
      const { nodes } = query?.data?.searchGiftCards;
      if (nodes && nodes.length > 0) {
        this.setState({ giftCardList: nodes });
      } else {
        this.setState({ giftCardList: [] });
      }
    } catch (err) {
      console.log("error : ", err);
      this.setState({ giftCardList: [] });
    }
  };

  getRecentAddress = async () => {
    const { user } = this.context;
    let query = await this.props.client.query({
      query: List_Recent_Stored_User_Addresses,
      variables: {
        userId: user.rowId,
      },
    });
    let { nodes } = query?.data?.searchRecentAddress;
    if (nodes && nodes.length > 0) {
      const address = nodes[0];
      const { postalCode, suburb, state, addressLine1, addressLine2 } = address;
      this.setState({ postalCode, suburb, state, addressLine1, addressLine2 });
    } else {
      return this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "No stored address found!"
      );
    }
  };

  saveAddress = async () => {
    const { user } = this.context;
    const { postalCode, suburb, state, addressLine1, addressLine2 } =
      this.state;
    let query = await this.props.client.mutate({
      mutation: Create_User_Address,
      variables: {
        input: {
          address: {
            userId: user.rowId,
            addressLine1,
            addressLine2,
            state,
            suburb,
            postalCode: postalCode || "",
            isResidential: false,
            isManual: false,
            isGps: false,
          },
        },
      },
    });
    let { address } = query?.data?.createAddress;
    if (address && address.addressLine1) {
      console.log("Saved Address", query);
    } else {
      return this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "No stored address found!"
      );
    }
  };

  createOrder = async () => {
    const { user } = this.context;
    let {
      totalPrice,
      isEcoupon,
      addressLine1,
      postalCode,
      state,
      suburb,
      isGiftCard,
    } = this.state;
    if (!postalCode) {
      postalCode = " ";
    }
    if (!addressLine1 || !postalCode || !state || !suburb)
      return this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Please fill up all fields"
      );
    if (isGiftCard) this.useGiftCard();
    try {
      let query = await this.props.client.mutate({
        mutation: Create_New_Order,
        variables: {
          order: {
            order: {
              userId: user.rowId,
              totalPrice,
              isEcoupon,
            },
          },
        },
      });
      let { order } = query?.data?.createOrder;
      if (order && order.rowId) {
        console.log("Created order", query);
        this.dropDownAlertRef.alertWithType(
          "success",
          "Success",
          "Order created!"
        );
        this.saveAddress();
        this.createItemOrders(order.rowId);
      } else {
        console.log(e, "Could not create order");
        return this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Could not create order"
        );
      }
    } catch (e) {
      console.log(e, "Could not create order");
      return this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Could not create order"
      );
    }
  };

  createItemOrders = async (orderId) => {
    const { cart } = this.context;
    for (const item of cart) {
      const { pizzaId, pizzaPrice, pizzaSize, pizzaBase, isDeal } = item;
      try {
        let query = await this.props.client.mutate({
          mutation: Create_New_Order_Item,
          variables: {
            item: {
              orderItem: {
                orderId,
                pizzaId,
                pizzaQuantity: 1,
                pizzaPrice,
                pizzaSize,
                pizzaBase,
                isDeal,
              },
            },
          },
        });
        let { orderItem } = query?.data?.createOrderItem;
        if (orderItem && orderItem.rowId) {
          console.log("Created item order", query);
        }
      } catch (e) {
        console.log(e, "Could not confirm order items nested");
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Could not confirm order items"
        );
      }
    }
    this.setShowModal(true);
  };

  applyCoupon = () => {
    let { couponList, couponCode, totalPrice } = this.state;
    let zeroPrice = false;
    const couponObj = couponList.find((item) => item.ecouponcode == couponCode);
    if (couponObj) {
      this.dropDownAlertRef.alertWithType(
        "success",
        "Success",
        "Coupon code applied"
      );
      totalPrice = totalPrice - Number(couponObj.ecouponAmount);
      if (totalPrice <= 0) {
        totalPrice = 0;
        zeroPrice = true;
      }
      this.setState({
        totalPrice,
        isEcoupon: true,
        zeroPrice,
      });
    } else {
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Could not apply coupon code"
      );
      this.setState({ isEcoupon: false });
    }
  };

  redeemGift = () => {
    let { giftCardList, giftCode, totalPrice, zeroPrice } = this.state;
    const giftCardObj = giftCardList.find(
      (item) => item.giftcardcode == giftCode
    );
    if (giftCardObj) {
      this.dropDownAlertRef.alertWithType(
        "success",
        "Success",
        "Gift card redeemed"
      );
      totalPrice = totalPrice - Number(giftCardObj.actualValue);
      let giftCardActualValue = giftCardObj.actualValue;
      if (totalPrice <= 0) {
        giftCardActualValue = giftCardActualValue - Math.abs(totalPrice);
        totalPrice = 0;
        zeroPrice = true;
      }
      this.setState({
        totalPrice,
        isGiftCard: true,
        giftCardActualValue,
        zeroPrice,
      });
    } else {
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Could not redeem gift card"
      );
      this.setState({ isGiftCard: false });
    }
  };

  useGiftCard = async () => {
    let { isGiftCard, giftCardActualValue, giftCardList, giftCode } =
      this.state;
    try {
      if (isGiftCard) {
        const giftCardObj = giftCardList.find(
          (item) => item.giftcardcode == giftCode
        );
        let query = await this.props.client.mutate({
          mutation: Use_Gift_Card,
          variables: {
            update: {
              rowId: giftCardObj.rowId,
              giftCardPatch: {
                actualValue: giftCardObj.actualValue - giftCardActualValue,
                usedAt: new Date().toISOString(),
              },
            },
          },
        });
        let { giftCard } = query?.data?.updateGiftCardByRowId;
        if (giftCard && giftCard.usedAt) {
          console.log("Used Gift card", query);
        }
      }
    } catch (e) {
      console.log(e, "Could not use gift card");
    }
  };

  onOk = () => {
    const { resetCart } = this.context;
    const { navigation } = this.props;
    this.setShowModal(false);
    resetCart();
    setTimeout(
      () => navigation.navigate("CustomerMenu", { order: true }),
      1000
    );
  };

  setShowModal = (showModal) => {
    this.setState({ showModal });
  };

  render() {
    const { cart } = this.context;
    const {
      showModal,
      postalCode,
      suburb,
      state,
      addressLine1,
      addressLine2,
      giftCardList,
      couponList,
      totalPrice,
      couponCode,
      giftCode,
      isEcoupon,
      isGiftCard,
      zeroPrice,
    } = this.state;
    console.log(this.state);
    return (
      <View style={{ padding: 20 }}>
        {showModal && (
          <ConfirmModal
            message={
              "Order Confirmed! Thank you for ordering with us! Your food should be ready in 10mins"
            }
            onOk={this.onOk}
            onSetShowModal={this.setShowModal}
          />
        )}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={styles.orderIconStyle}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                borderRadius: 14,
              }}
            >
              <View style={{ marginLeft: 30 }}>
                <Image
                  source={orderIcon}
                  style={{
                    width: 20,
                    height: 20,
                    margin: 5,
                    marginLeft: 20,
                  }}
                />
              </View>
              <Text style={styles.orderTextStyle}>Order</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            overflow: "scroll",
            maxHeight: height * 0.45,
            marginBottom: 20,
          }}
        >
          {cart.map((item) => (
            <ViewOrderRow row={item} navigation={this.props.navigation} />
          ))}
        </View>
        <View style={{ textAlign: "left", justifyContent: "left", margin: 10 }}>
          <Text style={{ fontWeight: 700, textAlign: "left", fontSize: 24 }}>
            Total : ${totalPrice}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            value={couponCode}
            disabled={isEcoupon}
            placeholder="E-Coupon"
            autoCapitalize="none"
            placeholderTextColor="black"
            onChangeText={(val) => this.onChangeText("couponCode", val)}
          />
          <TouchableOpacity
            style={styles.redeemButtonStyle}
            disabled={isEcoupon}
            onPress={() => this.applyCoupon()}
          >
            <Text style={styles.redeemTextStyle}>Apply</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            value={giftCode}
            disabled={zeroPrice || isGiftCard}
            placeholder="Gift Card"
            autoCapitalize="none"
            placeholderTextColor="black"
            onChangeText={(val) => this.onChangeText("giftCode", val)}
          />
          <TouchableOpacity
            style={styles.redeemButtonStyle}
            disabled={zeroPrice || isGiftCard}
            onPress={() => this.redeemGift()}
          >
            <Text style={styles.redeemTextStyle}>Redeem</Text>
          </TouchableOpacity>
        </View>
        <View style={{ textAlign: "left", justifyContent: "left", margin: 10 }}>
          <Text style={{ textAlign: "left", fontSize: 24 }}>E-Coupons</Text>
        </View>
        <View
          style={{
            overflowY: "auto",
            height: height * 0.3,
            marginBottom: 20,
            width: "100%",
          }}
        >
          {couponList.map((item) => (
            <EcouponRow row={item} />
          ))}
        </View>
        <View style={{ textAlign: "left", justifyContent: "left", margin: 10 }}>
          <Text style={{ textAlign: "left", fontSize: 24 }}>Gift Cards</Text>
        </View>
        <View
          style={{
            overflowY: "auto",
            height: height * 0.3,
            marginBottom: 20,
            width: "100%",
          }}
        >
          {giftCardList.map((item) => (
            <PurchasedGiftCardRow row={item} />
          ))}
        </View>
        <View style={{ textAlign: "left", justifyContent: "left", margin: 10 }}>
          <Text style={{ textAlign: "left", fontSize: 24 }}>
            Delivery Address
          </Text>
        </View>
        <TextInput
          style={styles.input}
          value={addressLine1}
          placeholder="Address Line 1"
          autoCapitalize="none"
          placeholderTextColor="black"
          onChangeText={(val) => this.onChangeText("addressLine1", val)}
        />
        <TextInput
          style={styles.input}
          value={addressLine2}
          placeholder="Address Line 2"
          autoCapitalize="none"
          placeholderTextColor="black"
          onChangeText={(val) => this.onChangeText("addressLine2", val)}
        />
        <TextInput
          style={styles.input}
          value={suburb}
          placeholder="Suburb"
          autoCapitalize="none"
          placeholderTextColor="black"
          onChangeText={(val) => this.onChangeText("suburb", val)}
        />
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={{
              width: 350,
              backgroundColor: "#4db6ac",
              margin: 10,
              padding: 8,
              color: "black",
              borderRadius: 14,
              fontSize: 18,
              width: "50%",
            }}
            keyboardType="numeric"
            value={postalCode}
            placeholder="Postcode"
            autoCapitalize="none"
            placeholderTextColor="black"
            onChangeText={(val) => this.onChangeText("postalCode", val)}
          />
          <TextInput
            style={{
              width: 350,
              backgroundColor: "#4db6ac",
              margin: 10,
              padding: 8,
              color: "black",
              borderRadius: 14,
              fontSize: 18,
              width: "50%",
            }}
            value={state}
            placeholder="State"
            autoCapitalize="none"
            placeholderTextColor="black"
            onChangeText={(val) => this.onChangeText("state", val)}
          />
        </View>
        <View style={styles.menuButtonStyle}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              margin: 10,
            }}
            onPress={() => this.getRecentAddress()}
          >
            <View>
              {" "}
              <Text style={styles.buttonTextStyle}>Use Stored Location</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.menuButtonStyle}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              margin: 10,
            }}
            onPress={() => this.createOrder()}
          >
            <View>
              {" "}
              <Text style={styles.buttonTextStyle}>Confirm & Place Order</Text>
            </View>
          </TouchableOpacity>
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#4db6ac",
    margin: 10,
    padding: 8,
    color: "black",
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
  orderIconStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(196, 196, 196, 1)",
    paddingBottom: 10,
    paddingTop: 10,
    height: 40,
    width: 200,
    margin: 5,
    flexDirection: "row",
    borderRadius: 25,
  },
  redeemButtonStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(57, 79, 81, 1)",
    paddingBottom: 10,
    paddingTop: 10,
    height: 40,
    width: 75,
    margin: 5,
    flexDirection: "row",
    borderRadius: 10,
    color: "white",
    margin: "auto",
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
    margin: "auto",
    marginBottom: 10,
    flexDirection: "row",
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
    margin: "auto",
    marginLeft: 10,
  },
  orderTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "black",
    margin: "auto",
    marginLeft: 10,
  },
  redeemTextStyle: {
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

ViewOrder.contextType = Context;
export default compose(
  withApollo,
  graphql(List_Current_Food_Items, { name: "List_Current_Food_Items" }),
  graphql(List_Deals, { name: "List_Deals" }),
  graphql(Create_User_Address, { name: "Create_User_Address" }),
  graphql(List_Ecoupons, { name: "List_Ecoupons" }),
  graphql(List_Gift_Cards, { name: "List_Gift_Cards" }),
  graphql(Create_New_Order_Item, { name: "Create_New_Order_Item" }),
  graphql(Use_Gift_Card, { name: "Use_Gift_Card" }),
  graphql(Create_New_Order, { name: "Create_New_Order" }),
  graphql(List_Recent_Stored_User_Addresses, {
    name: "List_Recent_Stored_User_Addresses",
  })
)(ViewOrder);
List_Ecoupons;
