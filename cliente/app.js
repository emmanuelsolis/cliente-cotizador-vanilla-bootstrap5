/* Punto de entrada principal para la lógica del cliente. */
import { api } from './api.js';

const $ = (sel) => document.querySelector(sel);
let svc;

function base() { 
  const b = $('#baseUrl').value.trim().replace(/\/+$/,''); 
  svc = api(b); 
}

window.addEventListener('DOMContentLoaded', async () => {
  base();
  $('#baseUrl').addEventListener('change', base);

  // Clients
  $('#formClient').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await svc.createClient(Object.fromEntries(fd));
    e.target.reset(); await renderClients(); await fillClientsSelect();
  });
  await renderClients();

  // Services
  $('#formService').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd);
    payload.price = parseFloat(payload.price);
    await svc.createService(payload);
    e.target.reset(); await renderServices();
  });
  await renderServices();

  // Quotes
  $('#formQuote').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    let items = [];
    try { items = JSON.parse(fd.get('items')); } catch { alert('Items debe ser JSON'); return; }
    const payload = { client_id: fd.get('client_id'), quote_date: fd.get('quote_date'), items };
    await svc.createQuote(payload);
    e.target.reset(); await renderQuotes();
  });
  await fillClientsSelect(); await renderQuotes();

  // Payments
  $('#formPayment').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      quote_id: fd.get('quote_id'),
      payment_date: fd.get('payment_date'),
      payment_amount: parseFloat(fd.get('payment_amount'))
    };
    await svc.createPayment(payload);
    e.target.reset(); await renderPayments();
  });
  await renderPayments();
});

/* ---------- Renders ---------- */
async function renderClients() {
  const rows = await svc.listClients();
  const tbody = $('#tblClients tbody'); tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.client_id}</td>
      <td>${r.name}</td>
      <td>${r.contact_info}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger">Eliminar</button>
      </td>`;
    tr.querySelector('button').onclick = async () => { await svc.deleteClient(r.client_id); await renderClients(); await fillClientsSelect(); };
    tbody.appendChild(tr);
  });
}

async function renderServices() {
  const rows = await svc.listServices();
  const tbody = $('#tblServices tbody'); tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.service_id}</td>
      <td>${r.service_name}</td>
      <td>$${Number(r.price).toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger">Eliminar</button>
      </td>`;
    tr.querySelector('button').onclick = async () => { await svc.deleteService(r.service_id); await renderServices(); };
    tbody.appendChild(tr);
  });
}

async function renderQuotes() {
  const rows = await svc.listQuotes();
  const tbody = $('#tblQuotes tbody'); tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.quote_id}</td>
      <td>${r.client_name || r.client_id}</td>
      <td>${r.quote_date}</td>
      <td>$${Number(r.total_amount ?? 0).toFixed(2)}</td>
      <td>${r.status ?? 'draft'}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary">Ver</button>
      </td>`;
    tr.querySelector('button').onclick = async () => {
      const q = await svc.getQuote(r.quote_id);
      alert(`Items:\n${q.items.map(i => `• ${i.service_name || i.service_id} x ${i.qty} = $${i.line_total}`).join('\n')}`);
    };
    tbody.appendChild(tr);
  });
}

async function renderPayments() {
  const rows = await svc.listPayments();
  const tbody = $('#tblPayments tbody'); tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.payment_id}</td>
      <td>${r.quote_id}</td>
      <td>${r.payment_date}</td>
      <td>$${Number(r.payment_amount).toFixed(2)}</td>
      <td></td>`;
    tbody.appendChild(tr);
  });
}

async function fillClientsSelect() {
  const list = await svc.listClients();
  const sel = document.querySelector('#formQuote select[name="client_id"]');
  sel.innerHTML = '';
  list.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.client_id; opt.textContent = `${c.client_id} — ${c.name}`;
    sel.appendChild(opt);
  });
}
