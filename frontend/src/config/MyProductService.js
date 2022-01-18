import axios from 'axios';
import { MAIN_URL } from './Url';

export function fetchProductService(){
    return axios.get(`${MAIN_URL}products/fetchProductService`)
} 
export function cartService(data){
    return axios.post(`${MAIN_URL}products/cartService`,data)
} 
export function checkOutService(data){
    return axios.post(`${MAIN_URL}products/checkOutService`,data)
} 
export function orderService(data){
    return axios.post(`${MAIN_URL}products/orderService`,data)
}
export function applyFilterService(data){
    return axios.post(`${MAIN_URL}products/applyFilterService`,data)
}
export function fetchRateProduct(data){
    return axios.post(`${MAIN_URL}products/fetchRateProduct`,data)

}
export function rateProductService(data){
    return axios.post(`${MAIN_URL}products/rateProductService`,data)

}