export async function httpClient(url, options = {}) {
  const response = await fetch(url, options)
  return response.json()
}

export default httpClient