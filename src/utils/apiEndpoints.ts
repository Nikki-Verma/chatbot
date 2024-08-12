const __EDGE_URL__ ='https://edge-service.simplai.ai';

const __IDENTITY_BASE_URL__ ='/identity-service';
const __INTRACT_BASE_URL__ = 'https://interact.simplai.ai';

export const BASE_URLS = {
  identity: `${__EDGE_URL__}${__IDENTITY_BASE_URL__}`,
  intract: `${__INTRACT_BASE_URL__}`,
};

const config = {
  identity: {
    createSession: `${BASE_URLS.identity}/session/create`,
    getGuestSession: `${BASE_URLS.identity}/user/token`,
  },
  intract: {
    initiateConversation: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
    streamResponse: `${BASE_URLS.intract}/api/v1/intract/data`,
    chatHistoryList: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
    chatDetails: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
  },
  embed: {
    config: `${BASE_URLS.intract}/api/v1/intract/embed/config`,
  },
};

export default config;
