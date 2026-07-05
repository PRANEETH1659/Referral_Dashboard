import Cookies from 'js-cookie'

const AUTH_URL =
  'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'
const REFERRALS_URL =
  'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

async function parseJson(response) {
  const text = await response.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    return {message: text || 'Unexpected response'}
  }
}

function getAuthHeaders() {
  const token = Cookies.get('jwt_token')
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function loginUser(payload) {
  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  })
  const data = await parseJson(response)
  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }
  return data
}

export async function fetchReferrals(params = {}) {
  const url = new URL(REFERRALS_URL)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      url.searchParams.set(key, value)
    }
  })
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  })
  const data = await parseJson(response)
  if (!response.ok) {
    const message = data.message || 'Failed to fetch referrals'
    throw new Error(`${message}${response.status ? ` (${response.status})` : ''}`)
  }
  return data
}
