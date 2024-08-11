const __EDGE_URL__ ='https://edge-service-preprod.simplai.ai';

const __IDENTITY_BASE_URL__ ='/identity-service';
const __INTRACT_BASE_URL__ = '/interact';

export const BASE_URLS = {
  identity: `${__EDGE_URL__}${__IDENTITY_BASE_URL__}`,
  intract: `${__EDGE_URL__}${__INTRACT_BASE_URL__}`,
};

const config = {
  identity: {
    createSession: `${BASE_URLS.identity}/session/create`,
    getGuestSession: `${BASE_URLS.identity}/user/token`,
  },
  intract: {
    initiateConversation: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
    streamResponse: `${BASE_URLS.intract}/api/v1/intract/embed/conversation/fetch`,
    chatHistoryList: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
    chatDetails: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
  },
  embed: {
    config: `${BASE_URLS.intract}/api/v1/intract/embed/config`,
  },
};

export default config;
