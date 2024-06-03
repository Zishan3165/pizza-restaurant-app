import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import OnboardPage from "./Screens/OnboardPage";
import Login from "./Screens/Login";
import SignUp from "./Screens/SignUp";
import AdminPage from "./Screens/AdminPage";
import CreatePizza from "./Screens/CreatePizza";
import CodeVerification from "./Screens/CodeVerification";
import CustomerMenu from "./Screens/CustomerMenu";
import CustomizePizza from "./Screens/CustomizePizza";
import ModifyPizza from "./Screens/ModifyPizza";
import CreateCoupon from "./Screens/CreateCoupon";
import CreateDeal from "./Screens/CreateDeal";
import BuyGiftCard from "./Screens/BuyGiftCard";
import ViewOrder from "./Screens/ViewOrder";
import Provider from "./store/provider";
import { ApolloProvider } from "react-apollo";
import OrderHistory from "./Screens/OrderHistory";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const Stack = createStackNavigator();

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
  defaultOptions,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={"OnboardPage"}>
            <Stack.Screen
              name="OnboardPage"
              component={OnboardPage}
              options={{ title: "Welcome" }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: "Sign In" }}
            />
            <Stack.Screen
              name="CodeVerification"
              component={CodeVerification}
            />
            <Stack.Screen
              options={({ navigation }) => ({
                headerLeft: () => null,
              })}
              name="AdminPage"
              component={AdminPage}
              options={{ title: "Admin Panel" }}
            />
            <Stack.Screen
              options={({ navigation }) => ({
                headerLeft: () => null,
              })}
              name="CustomerMenu"
              component={CustomerMenu}
              options={{ title: "Cucina Vostra Pizzeria" }}
            />
            <Stack.Screen
              name="CustomizePizza"
              component={CustomizePizza}
              options={{ title: "Customize Pizza" }}
            />
            <Stack.Screen name="ModifyPizza" component={ModifyPizza} />
            <Stack.Screen name="CreatePizza" component={CreatePizza} />
            <Stack.Screen name="CreateCoupon" component={CreateCoupon} />
            <Stack.Screen name="CreateDeal" component={CreateDeal} />
            <Stack.Screen name="BuyGiftCard" component={BuyGiftCard} />
            <Stack.Screen name="ViewOrder" component={ViewOrder} />
            <Stack.Screen name="OrderHistory" component={OrderHistory} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
