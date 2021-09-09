import axiosInstance from '../axiosInstances/adminAxiosInstance'
import ApiService from '../apiService'

import users from "../../data/users";

const axios = new ApiService(axiosInstance)

export default class AdminApi {
    static async authUser () {
        const data = await axios.postRequest(``, users.adminUser)
        await axios.setAuthToken(data.jwt_token)
        return data
    }
    //...
}
