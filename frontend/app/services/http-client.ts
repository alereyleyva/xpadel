interface HttpClientOptions {
  accessToken?: string;
  body?: object;
  method: string;
}

export async function makeRequest<ResponseType>(
  path: string,
  options: HttpClientOptions = { method: "GET" }
): Promise<ResponseType> {
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

  const response = await fetch(`${process.env.API_URL}${path}`, requestOptions);

  return await response.json();
}

function getHeaders(options: HttpClientOptions): Headers {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  if (options.accessToken) {
    headers.append("Authorization", `Bearer ${options.accessToken}`);
  }

  return headers;
}
