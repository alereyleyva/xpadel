export async function postData<ResponseType>(
  path: string,
  data: unknown
): Promise<ResponseType> {
  const response = await fetch(`${process.env.API_URL}${path}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
