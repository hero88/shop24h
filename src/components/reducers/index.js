import { combineReducers } from 'redux';
import {GET_ALL_PRODUCT,GET_NUMBER_CART,ADD_CART, DECREASE_QUANTITY, INCREASE_QUANTITY, DELETE_CART} from  '../actions';

const initProduct = {
    numberCart:0,
    Carts:[],
    _products:[]
}

function todoProduct(state = initProduct,action){
    switch(action.type){
        case GET_ALL_PRODUCT: 
            return{
                ...state,
                _products:action.payload
            }
        case GET_NUMBER_CART:
                return{
                    ...state
                }
        case ADD_CART:
            let copy = [...state.Carts];
            let product = action.payload;
            if(copy.length === 0){
                copy.push(product); 
            }
            else{
                let check = false;                
                copy.map((item,key)=>{
                    if(item.productId === product.productId){
                        copy[key].quantity = copy[key].quantity+1;
                        check=true;
                    }
                    return copy;
                });
                if(!check) copy.push(product);
            }
            return{
                ...state,
                Carts: copy,
                numberCart: copy.length
            }
        case INCREASE_QUANTITY:
                state.numberCart++
                state.Carts[action.payload].quantity++;
              
               return{
                   ...state
               }
        case DECREASE_QUANTITY:
                let quantity = state.Carts[action.payload].quantity;
                if(quantity>1){
                    state.numberCart--;
                    state.Carts[action.payload].quantity--;
                }
              
                return{
                    ...state
                }
        case DELETE_CART:
                let quantity_ = state.Carts[action.payload].quantity;
                return{
                    ...state,
                    numberCart:state.numberCart - quantity_,
                    Carts:state.Carts.filter(item=>{
                        return item._id !== state.Carts[action.payload]._id
                    })
                   
                }
        default:
            return state;
    }
}

const ShopApp = combineReducers({
    _todoProduct: todoProduct
});

export default ShopApp;