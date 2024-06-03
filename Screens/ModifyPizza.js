import React, { Component } from "react";
import DropdownAlert from "react-native-dropdownalert";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { Update_Pizza_Item } from "./../Database";
import { graphql, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";
import { ButtonGroup } from "react-native-elements";

const sizes = ["Small", "Medium", "Large"];
const bases = ["Low", "High"];

class ModifyPizza extends Component {
  state = {
    pizzaName: "",
    pizzaDescription: "",
    defaultSize: 0,
    defaultBase: 0,
    smallPrice: "",
    mediumPrice: "",
    largePrice: "",
    imageUrl: "",
    showImage: false,
    verified: true,
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
      marginTop,
      imageUrl,
      mediumPrice,
      rowId,
    } = pizzaObj;
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
      marginTop,
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

  updatePizza = async () => {
    let {
      pizzaDescription,
      defaultSize,
      defaultBase,
      smallPrice,
      mediumPrice,
      largePrice,
      rowId,
      imageUrl,
      pizzaName,
    } = this.state;
    const { navigation } = this.props;
    defaultSize = sizes[defaultSize].toLocaleLowerCase();
    defaultBase = bases[defaultBase].toLocaleLowerCase();
    try {
      if (
        !pizzaDescription ||
        !defaultSize ||
        !defaultBase ||
        !smallPrice ||
        !mediumPrice ||
        !largePrice
      ) {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Please fill up all the fields"
        );
        console.log("Please select all fields");
        return;
      }
      const pizzaObj = {
        pizzaName,
        imageUrl,
        pizzaDescription,
        defaultBase,
        defaultSize,
        smallPrice,
        mediumPrice,
        largePrice,
      };
      const query = await this.props.client.mutate({
        mutation: Update_Pizza_Item,
        variables: {
          update: {
            rowId,
            pizzaPatch: {
              isActive: false,
              deletedAt: new Date().toISOString(),
            },
          },
          create: {
            pizza: pizzaObj,
          },
        },
      });
      const { pizza } = query?.data?.updatePizzaByRowId;
      if (pizza && !pizza.isActive) {
        this.dropDownAlertRef.alertWithType(
          "success",
          "Success",
          "Pizza updated!"
        );
        setTimeout(
          () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "AdminPage" }],
            }),
          3000
        );
      } else {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Could not update pizza."
        );
      }
    } catch (err) {
      console.log("error : ", err);
    }
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
    } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleTextStyle}>{pizzaName}</Text>
        </View>
        <View
          style={{ textAlign: "left", justifyContent: "left", width: "77%" }}
        >
          <Text style={{ fontWeight: 700, textAlign: "left" }}>
            Pizza Description
          </Text>
        </View>
        <TextInput
          style={styles.textArea}
          multiline={true}
          numberOfLines={4}
          placeholder=""
          value={pizzaDescription}
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => this.onChangeText("pizzaDescription", val)}
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
          <View
            style={{
              justifyContent: "left",
              textAlign: "left",
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <Text
              style={{ marginTop: "auto", marginBottom: "auto", width: 85 }}
            >
              Small
            </Text>
            <TextInput
              keyboardType="numeric"
              style={styles.priceInputStyle}
              autoCapitalize="none"
              placeholderTextColor="white"
              value={smallPrice}
              onChangeText={(val) => this.onChangeText("smallPrice", val)}
            />
          </View>
          <View
            style={{
              justifyContent: "left",
              textAlign: "left",
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <Text
              style={{ marginTop: "auto", marginBottom: "auto", width: 85 }}
            >
              Medium
            </Text>
            <TextInput
              keyboardType="numeric"
              style={styles.priceInputStyle}
              autoCapitalize="none"
              placeholderTextColor="white"
              value={mediumPrice}
              onChangeText={(val) => this.onChangeText("mediumPrice", val)}
            />
          </View>
          <View
            style={{
              justifyContent: "left",
              textAlign: "left",
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <Text
              style={{ marginTop: "auto", marginBottom: "auto", width: 85 }}
            >
              Large
            </Text>
            <TextInput
              keyboardType="numeric"
              style={styles.priceInputStyle}
              autoCapitalize="none"
              placeholderTextColor="white"
              value={largePrice}
              onChangeText={(val) => this.onChangeText("largePrice", val)}
            />
          </View>
        </View>
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
        <View style={styles.spaceBetweenButton}></View>
        <View style={styles.signUpButtonStyle}>
          <TouchableOpacity onPress={() => this.updatePizza()}>
            <Text style={styles.buttonTextStyle}>UPDATE</Text>
          </TouchableOpacity>
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

export default compose(
  withApollo,
  graphql(Update_Pizza_Item, { name: "Update_Pizza_Item" })
)(ModifyPizza);
