import React, { Component } from "react";
import DropdownAlert from "react-native-dropdownalert";
import Context from "./../store/context";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { Update_Pizza_Item } from "./../Database";
import { graphql, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";
import { ButtonGroup } from "react-native-elements";

const sizes = ["Small", "Medium", "Large"];
const bases = ["Low", "High"];

class CustomizePizza extends Component {
  state = {
    pizzaName: "",
    pizzaDescription: "",
    defaultSize: 0,
    defaultBase: 0,
    smallPrice: "",
    mediumPrice: "",
    largePrice: "",
    imageUrl: "",
  };

  componentDidMount() {
    const { pizzaObj } = this.props?.route?.params;
    let {
      pizzaName,
      pizzaDescription,
      defaultBase,
      defaultSize,
      smallPrice,
      largePrice,
      imageUrl,
      mediumPrice,
      rowId,
    } = pizzaObj;
    if (pizzaObj.pizzaByPizzaId) {
      ({
        smallPrice,
        mediumPrice,
        largePrice,
        defaultBase,
        defaultSize,
        imageUrl,
        pizzaName,
        pizzaDescription,
        rowId,
      } = pizzaObj.pizzaByPizzaId);
    }
    defaultSize =
      defaultSize === "small" ? 0 : defaultSize === "medium" ? 1 : 2;
    defaultBase = defaultBase === "low" ? 0 : 1;
    this.setState({
      pizzaName,
      pizzaDescription,
      defaultBase,
      defaultSize,
      smallPrice,
      largePrice,
      imageUrl,
      mediumPrice,
      rowId,
    });
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  verifyUrl = () => {
    this.setState({ showImage: true });
  };

  addToOrder = async () => {
    const { pizzaObj } = this.props?.route?.params;
    const { addToCart } = this.context;

    let { smallPrice, mediumPrice, largePrice, dealDiscount, rowId } = pizzaObj;
    if (pizzaObj.pizzaByPizzaId) {
      ({ smallPrice, mediumPrice, largePrice } = pizzaObj.pizzaByPizzaId);
    }
    const { defaultBase, defaultSize } = this.state;
    if (dealDiscount) {
      smallPrice = smallPrice - (smallPrice * Number(dealDiscount)) / 100;
      mediumPrice = mediumPrice - (mediumPrice * Number(dealDiscount)) / 100;
      largePrice = largePrice - (largePrice * Number(dealDiscount)) / 100;
    }

    addToCart({
      ...pizzaObj,
      pizzaId: row.pizzaByPizzaId ? row.pizzaId : rowId,
      pizzaQuantity: 1,
      pizzaPrice:
        defaultSize === 0
          ? smallPrice
          : defaultSize === 1
          ? mediumPrice
          : largePrice,
      pizzaSize:
        defaultSize === 0 ? "small" : defaultSize === 1 ? "medium" : "large",
      pizzaBase: defaultBase === 0 ? "low" : "high",
      isDeal: dealDiscount ? true : false,
    });
    this.props.navigation.replace("CustomerMenu");
  };

  handleInvalidImage = () => {
    this.dropDownAlertRef.alertWithType("error", "Error", "Invalid Url");
    this.setState({ showImage: false });
  };

  handleBase = (evt) => {
    this.setState({ defaultBase: evt });
  };

  handleSize = (evt) => {
    this.setState({ defaultSize: evt });
  };

  render() {
    const {
      pizzaName,
      pizzaDescription,
      defaultBase,
      defaultSize,
      smallPrice,
      mediumPrice,
      largePrice,
      imageUrl,
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.titleTextStyle}>{pizzaName}</Text>
        <Image
          source={imageUrl}
          onError={() => this.handleInvalidImage()}
          style={{
            width: 150,
            height: 150,
            margin: 5,
            borderRadius: 100,
          }}
        />
        <View
          style={{ textAlign: "left", justifyContent: "left", width: "77%" }}
        >
          <Text style={{ fontWeight: 700, textAlign: "left" }}>
            Pizza Description
          </Text>
        </View>
        <TextInput
          style={styles.textArea}
          disabled
          multiline={true}
          numberOfLines={4}
          placeholder=""
          value={pizzaDescription}
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => this.onChangeText("pizzaDescription", val)}
        />
        <View
          style={{ textAlign: "left", justifyContent: "left", width: "77%" }}
        >
          <Text style={{ fontWeight: 700, textAlign: "left" }}>
            Default Size
          </Text>
        </View>
        <ButtonGroup
          onPress={this.handleSize}
          selectedIndex={defaultSize}
          buttons={sizes}
          buttonStyle={{ color: "white" }}
          selectedButtonStyle={{ color: "white", backgroundColor: "#394F51" }}
          containerStyle={{
            height: 36,
            width: 280,
            backgroundColor: "rgba(58, 158, 152, 0.29)",
            color: "black",
            fontSize: 24,
          }}
        />
        <View
          style={{ textAlign: "left", justifyContent: "left", width: "77%" }}
        >
          <Text style={{ fontWeight: 700, textAlign: "left" }}>
            Default Base
          </Text>
        </View>
        <ButtonGroup
          onPress={this.handleBase}
          selectedIndex={defaultBase}
          buttons={bases}
          buttonStyle={{ color: "white" }}
          selectedButtonStyle={{ color: "white", backgroundColor: "#394F51" }}
          containerStyle={{
            height: 36,
            width: 280,
            backgroundColor: "rgba(58, 158, 152, 0.29)",
            color: "black",
            fontSize: 24,
          }}
        />
        <View
          style={{
            textAlign: "left",
            justifyContent: "left",
            width: "77%",
            marginTop: 10,
          }}
        >
          <Text style={{ fontWeight: 700, textAlign: "left" }}>Price</Text>
        </View>
        <View
          style={{ textAlign: "left", justifyContent: "left", width: "77%" }}
        >
          <TextInput
            style={styles.priceInputStyle}
            autoCapitalize="none"
            disabled
            placeholderTextColor="white"
            value={`$ ${
              defaultSize === 0
                ? smallPrice
                : defaultSize === 1
                ? mediumPrice
                : largePrice
            }`}
            onChangeText={(val) => this.onChangeText("smallPrice", val)}
          />
        </View>
        <View style={styles.spaceBetweenButton}></View>
        <View style={styles.signUpButtonStyle}>
          <TouchableOpacity onPress={() => this.addToOrder()}>
            <Text style={styles.buttonTextStyle}>ADD TO ORDER</Text>
          </TouchableOpacity>
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  priceInputStyle: {
    width: "35%",
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
    justifyContent: "center",
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
});
CustomizePizza.contextType = Context;
export default compose(
  withApollo,
  graphql(Update_Pizza_Item, { name: "Update_Pizza_Item" })
)(CustomizePizza);
