export interface UserSession {
  email: string;
  accessToken: string;
}

interface SucceededAuthenticationResponse {
  accessToken: string;
}

interface FailedAuthenticationResponse {
  error: string;
}

export type AuthenticationResponse =
  | SucceededAuthenticationResponse
  | FailedAuthenticationResponse;

export function isFailedAuthentication(
  response: AuthenticationResponse
): response is FailedAuthenticationResponse {
  return "error" in response;
}
