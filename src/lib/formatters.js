export function formatDate(value) {
  if (!value) return '-'
  return value.replaceAll('-', '/')
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function normalizeDashboardData(payload) {
  const data = payload?.data || payload || {}
  return {
    metrics: Array.isArray(data.metrics) ? data.metrics : [],
    serviceSummary: data.serviceSummary || {},
    referral: data.referral || {},
    referrals: Array.isArray(data.referrals) ? data.referrals : [],
  }
}

export function normalizeReferralDetail(payload, requestedId) {
  const data = payload?.data || payload || {}
  if (Array.isArray(data.referrals)) {
    return data.referrals.find(item => String(item.id) === String(requestedId)) || null
  }
  if (data && String(data.id) === String(requestedId)) {
    return data
  }
  return null
}
