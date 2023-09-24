import {createClient} from "contentful"

const cSpace = process.env.REACT_APP_CONTENTFUL_SPACE;
const cToken = process.env.REACT_APP_CONTENTFUL_TOKEN;

export default createClient({
    space: cSpace,
    accessToken: cToken
})