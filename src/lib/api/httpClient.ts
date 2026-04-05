export async function httpClient<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, options)
  return response.json() as Promise<T>
}

export default httpClient