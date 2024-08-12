import _authHttp from "../services/authHttp";
import config from "../utils/apiEndpoints";

export const initiateConversationApi = ({
  payload = {},
  headers = {},
  signal,
} : any) => {
  return _authHttp.post(config.intract.initiateConversation, payload, {
    headers,
    signal,
  });
};
