import axios from "axios";

export const httpClient = axios.create({
  baseURL: process.env.API_URL,
});

interface HttpClientOptions {
  accessToken?: string;
  body?: object;
  method: string;
}

export async function makeRequest(
  path: string,
  options: HttpClientOptions = { method: "GET" },
): Promise<Response> {
  const headers = getHeaders(options);

  let requestOptions: RequestInit = {
    method: options.method,
    headers: headers,
  };

  if (options.body) {
    requestOptions = {
      ...requestOptions,
      body: JSON.stringify(options.body),
    };
  }

  return await fetch(`${process.env.API_URL}${path}`, requestOptions);
}

function getHeaders(options: HttpClientOptions): Headers {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  if (options.accessToken) {
    headers.append("Authorization", `Bearer ${options.accessToken}`);
  }

  return headers;
}
