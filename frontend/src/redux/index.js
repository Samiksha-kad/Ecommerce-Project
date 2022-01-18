import { combineReducers, createStore } from "redux";
import Swal from 'sweetalert2'

let initialstate = { name: "", profile: "", searchKeyword: "" }
 
export const profileReducer = (state = initialstate, action) => {
 
    switch (action.type) {
        case "updateProfile":
            return { name: action.payload, profile: state.profile, searchKeyword: state.searchKeyword };

        case "updatePicture":
            return { profile: action.payload, name: state.name, searchKeyword: state.searchKeyword };

        case "searchKeyword":
            return { profile: state.profile, name: state.name, searchKeyword: action.payload };

        default: return state;
    }
}
let x = 0;
if (localStorage.getItem('cart') != undefined) {
    x = JSON.parse(localStorage.getItem('cart')).length
}
let initial = { count: x }
export const cartReducer = (state = initial, action) => {
    switch (action.type) {
        case "addCartDispatch":
            if (localStorage.getItem('cart') != undefined) {
                let cart = JSON.parse(localStorage.getItem('cart'))
                if (!cart.find(ele => ele._id === action.payload._id)) {
                    localStorage.setItem('cart', JSON.stringify([...cart, { ...action.payload, quantity: 1 }]))
                    return { count: cart.length + 1 };
                }
                else{
                    Swal.fire({
                        title: 'Oops...',
                        text: 'Product already added to cart',
                      })
                }
            }
            else {
                let arr = []
                arr.push({ ...action.payload, quantity: 1 })
                localStorage.setItem('cart', JSON.stringify(arr))
                return { count: 1 };
            }
            break;

            
        case 'onLoginDispatch':
            if (localStorage.getItem('cart') != undefined) {
                let cart = JSON.parse(localStorage.getItem('cart'))
                let arr = [...cart]
                
                action.payload.forEach(element => {
                    if (!cart.find(ele => ele._id === element._id)) {
                        arr.push(element) 
                    }                   
                });
                localStorage.setItem('cart', JSON.stringify([...arr]))
                return { count: [...arr].length }
            }
            else {
                if (action.payload != null) {
                    localStorage.setItem('cart', JSON.stringify([...action.payload]))
                    return { count: [...action.payload].length }
                } else {
                    localStorage.setItem('cart', JSON.stringify([]))
                    return { count: 0 }
                }
            }

        case "deleteInCart":
            let cartValues = JSON.parse(localStorage.getItem('cart'))
            cartValues.splice(action.payload, 1)
            localStorage.setItem("cart", JSON.stringify([...cartValues]));
            return { count: cartValues.length }

        case 'emptyCart':
            return { count: 0 }

        default: return state;
    }
}

const rootReducer = combineReducers({ profileReducer,cartReducer });

const store = createStore(rootReducer);

export default store;