export interface UserSession {
  email: string;
  accessToken: string;
}

export interface User {
  email: string;
  userProfile: UserProfile;
}

export interface UserProfile {
  avatar: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  instagramAccount: string | null;
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
  response: AuthenticationResponse,
): response is FailedAuthenticationResponse {
  return "error" in response;
}
