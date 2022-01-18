import axios from 'axios';
import {MAIN_URL} from './Url'   

export function addPosts(data){
    return axios.post(`${MAIN_URL}posts/addpost`,data) 
}

export function validation(data){
    return axios.post(`${MAIN_URL}posts/validate`,data) 
}
export function forgetService(data){
    return axios.post(`${MAIN_URL}posts/forgetservice`,data) 
}
export function resetPassService(data){
    return axios.post(`${MAIN_URL}posts/resetService`,data) 
}
export function changePasswordService(data){
    return axios.post(`${MAIN_URL}posts/changePaswordService`,data) 
}
export function profileeditService(data){
    return axios.post(`${MAIN_URL}posts/profileeditService`,data)
}


export function addAddressService(data){
    return axios.post(`${MAIN_URL}posts/addAddressService`,data)
} 

export function profilePicService(data){
    return axios.post(`${MAIN_URL}posts/profilePicService`,data)
} 
export function emailSubscribeService(data){
    return axios.post(`${MAIN_URL}posts/emailSubscribeService`,data)
} 
export function cartSaveService(data){
    return axios.post(`${MAIN_URL}posts/cartSaveService`,data)
} 
 