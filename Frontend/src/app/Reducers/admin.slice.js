import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminData:{
        email:"admin@gmail.com"
    },
    isAdminLoggedIn : false
}

export const AdminSlice = createSlice({
    name:"admin",
    initialState:initialState,
    reducers:{
            logInAdmin:(state,action)=>{
                state.isAdminLoggedIn = true;
                state.adminData = action.payload     
                console.log("admin state changed to true");
                
            },
            logOutAdmin:(state)=>{
                state.isAdminLoggedIn = false;
                state.adminData = initialState.adminData 
            },
            
    }
})

export const {
    logInAdmin,
    logOutAdmin
} = AdminSlice.actions

export default AdminSlice.reducer