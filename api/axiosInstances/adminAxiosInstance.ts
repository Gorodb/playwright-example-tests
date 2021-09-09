import Axios from 'axios';
import https from 'https';

import { config } from 'dotenv';

config();

const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    baseURL: process.env.ADMIN_API
})

export default axios;
