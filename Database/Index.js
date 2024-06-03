import {
    ApolloClient,
    InMemoryCache,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    cache: new InMemoryCache()
});

export const Get_Credentials_Confirmation_Login = gql`
    query userCredentials($condition: UserCondition!) {
        allUsers(condition: $condition) {
        nodes {
            rowId
            isAdmin
            userName
            userSurname
        }
        }
    }
`

export const Get_Admin_Code_Confirmation_During_Registration = gql`
    query adminCodes($condition: AdminCodeCondition!) {
        allAdminCodes(condition: $condition) {
        nodes {
            rowId
        }
        }
    }
`

export const Create_User_Account = gql`
    mutation createUserAccount($input: CreateUserInput!) {
        createUser(input: $input) {
        user {
            userName
            userSurname
            userEmail
            userPassword
            codeId
            isAdmin
        }
        }
    }
`

export const List_Current_Food_Items = gql`
query currentPizzas($condition: PizzaCondition!) {
    allPizzas(condition: $condition) {
      nodes {
        pizzaName
        pizzaDescription
        imageUrl
        smallPrice
        mediumPrice
        largePrice
        defaultSize
        defaultBase
        id
        rowId
      }
    }
  }
`

export const Store_Address_Details = gql`
    mutation createAddress($input: CreateAddressInput!) {
        createAddress(input: $input) {
        address {
            userId
            addressLine1
            addressLine2
            suburb
            state
            postalCode
            isResidential
            isManual
            isGps
        }
        }
    }
`

export const List_Stored_User_Addresses = gql`
    query AddressByUser($condition: AddressCondition!) {
        allAddresses(condition: $condition) {
        nodes {
            userId
            addressLine1
            addressLine2
            suburb
            state
            postalCode
            isResidential
            isManual
            isGps
        }
        }
    }
`

export const List_Recent_Stored_User_Addresses = gql`
    query AddressByUserRecent($userId: Int) {
        searchRecentAddress(user: $userId) {
        nodes {
            addressLine1
            addressLine2
            suburb
        state
        postalCode
        isResidential
        isManual
        isGps
        }
    }
    }
`

export const Create_New_Pizza_Item = gql`
    mutation createPizza($input: CreatePizzaInput!) {
        createPizza(input: $input) {
        pizza {
            userId
            pizzaName
            pizzaDescription
            imageUrl
            smallPrice
            mediumPrice
            largePrice
            defaultSize
            defaultBase
        }
        }
    }
`

export const Update_Pizza_Item = gql`
    mutation UpdatePizza($update: UpdatePizzaByRowIdInput!, $create: CreatePizzaInput!) {
        updatePizzaByRowId(input: $update) {
        pizza {
            deletedAt
            isActive
        }
        }
        createPizza(input: $create) {
        pizza {
            userId
            pizzaName
            pizzaDescription
            imageUrl
            smallPrice
            mediumPrice
            largePrice
            defaultSize
            defaultBase
        }
        }
    }
`

export const Delete_Pizza_Item = gql`
    mutation DeletePizza($update: UpdatePizzaByRowIdInput!) {
        updatePizzaByRowId(input: $update) {
        pizza {
            deletedAt
            isActive
            rowId
        }
        }
    }
`

export const Create_New_Deal = gql`
    mutation createDeal($input: CreateDealInput!) {
        createDeal(input: $input) {
        deal {
            pizzaId
            userId
            dealDiscount
        }
        }
    }
`

export const Create_New_Ecoupon = gql`
    mutation createEcoupon($input: CreateEcouponInput!) {
        createEcoupon(input: $input) {
        ecoupon {
            userId
            ecouponAmount
            validTo
            ecouponcode
        }
        }
    }
`

export const Create_New_Gift_Card = gql`
    mutation createGiftCard($input: CreateGiftCardInput!) {
        createGiftCard(input: $input) {
        giftCard {
            userId
            initialValue
            actualValue
            giftcardcode
        }
        }
    }
`

export const Use_Gift_Card = gql`
    mutation UpdateGiftCard($update: UpdateGiftCardByRowIdInput!) {
        updateGiftCardByRowId(input: $update) {
        giftCard {
            actualValue
            usedAt
        }
        }
    }
`

export const List_Gift_Cards = gql`
    query GiftCardsWithBalance($userId: Int) {
        searchGiftCards(balance: "0.00", user: $userId) {
        nodes {
        rowId
        initialValue
        actualValue
        createdAt
        usedAt
        giftcardcode
        }
    }
    }
`

export const List_Ecoupons = gql`
query ValidEcoupons($timestamp: Datetime){
    searchEcoupons(search: $timestamp) {
      nodes {
        rowId
        ecouponAmount
        validTo
        ecouponcode
      }
    }
  }
`

export const List_Deals = gql`
    query Deals($condition: DealCondition!) {
        allDeals(condition: $condition) {
        nodes {
            rowId
            pizzaId
            dealDiscount
            pizzaByPizzaId {
            id
            pizzaName
            pizzaDescription
            imageUrl
            smallPrice
            largePrice
            mediumPrice
            defaultSize
            defaultBase
            }
        }
        }
    }
`

export const Delete_Deal = gql`
    mutation updateDeal($update: UpdateDealByRowIdInput!) {
        updateDealByRowId(input: $update) {
        deal {
            deletedAt
            isValid
        }
        }
    }
`

export const Create_New_Order = gql`
    mutation createOrder($order: CreateOrderInput!) {
        createOrder(input: $order) {
        order {
            rowId
            userId
            totalPrice
            isEcoupon
        }
        }
    }
`

export const Create_User_Address = gql`
    mutation createAddress($input: CreateAddressInput!) {
        createAddress(input: $input) {
        address {
            userId
            addressLine1
            addressLine2
            suburb
            state
            postalCode
            isResidential
            isManual
            isGps
        }
        }
    }
`

export const Create_New_Order_Item = gql`
    mutation createOrderItem($item: CreateOrderItemInput!) {
        createOrderItem(input: $item) {
        orderItem {
            rowId
            orderId
            pizzaId
            pizzaQuantity
            pizzaPrice
            pizzaSize
            pizzaBase
            isDeal
        }
        }
    }
`

export const List_Order_History = gql`
    query Orders($condition: OrderCondition!) {
        allOrders(condition: $condition) {
        nodes {
            rowId
            userId
            totalPrice
            isEcoupon
            createdAt
            orderItemsByOrderId {
            nodes {
                    rowId
                    orderId
                    pizzaId
                    pizzaQuantity
                    pizzaPrice
                    pizzaSize
                    pizzaBase
                    isDeal
                    pizzaByPizzaId {
                        id
                        pizzaName
                        pizzaDescription
                        imageUrl
                        smallPrice
                        largePrice
                        mediumPrice
                        defaultSize
                        defaultBase
                        
                        }
            }
            }
        }
        }
    }
`