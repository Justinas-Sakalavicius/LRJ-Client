import { environment } from "src/environments/environment";

// API constants
export const API_URL = environment.apiUrl;

// Encoding service constants
export const QUERY_PARAM_NAME = 'input';
export const URL_ENCODE_START = `${API_URL}/encoding/start`;
export const URL_ENCODE_CANCEL = `${API_URL}/encoding/cancel`;

// Encoding component constants
export const INPUT_TEXT_REQUIRED = 'Input text is required';
export const ERROR_MESSAGE_WHILE_ENCODING = 'Error while executing encoding:';
export const ERROR_MESSAGE_WHILE_CANCELING = 'Error while cancelling encoding:';

//SignalR constants
export const HUB_URL = `${API_URL}/encodinghub`;
export const HUB_TARGET = 'ReceiveEncodedCharacter';
export const HUB_CONNECT_ERROR = 'Error while establishing connection';
export const HUB_DISCONNECT_ERROR = 'Error while disconnecting connection';
