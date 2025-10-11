/* Funciones para interactuar con la API del cotizador. */
// define baseUrl
const baseUrl = 'http://localhost:3000';

export function api() {

  const h = (m, path, body) =>
    fetch(`${baseUrl}${path}`, {
      method: m,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    }).then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)));

  return {
    // clients
    listClients: () => fetch(`${baseUrl}/api/clients`).then(r=>r.json()),
    getClient: (id) => fetch(`${baseUrl}/api/clients/${id}`).then(r=>r.json()),
    createClient: (payload) => h('POST', '/api/clients', payload),
    updateClient: (id, payload) => h('PUT', `/api/clients/${id}`, payload),
    deleteClient: (id) => fetch(`${baseUrl}/api/clients/${id}`, { method: 'DELETE' }).then(r=>r.json()),

    // services
    listServices: () => fetch(`${baseUrl}/api/services`).then(r=>r.json()),
    createService: (payload) => h('POST', '/api/services', payload),
    updateService: (id, payload) => h('PUT', `/api/services/${id}`, payload),
    deleteService: (id) => fetch(`${baseUrl}/api/services/${id}`, { method: 'DELETE' }).then(r=>r.json()),

    // quotes
    listQuotes: () => fetch(`${baseUrl}/api/quotes`).then(r=>r.json()),
    getQuote: (id) => fetch(`${baseUrl}/api/quotes/${id}`).then(r=>r.json()),
    createQuote: (payload) => h('POST', '/api/quotes', payload),

    // payments
    listPayments: () => fetch(`${baseUrl}/api/payments`).then(r=>r.json()),
    createPayment: (payload) => h('POST', '/api/payments', payload),
  };
}
