const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxBTz7ynhcEfDtQZRkBP7lldlghNIpaUQMR9Ux8EMY0tsCWcPNYmRKcZ2A9aOE7Q7zIeg/exec';

export async function submitCalcLead(lead: {
  fullName: string;
  email: string;
  phone: string;
  fromCity: string;
  fromZip: string;
  toCity: string;
  moveSize: string;
  moveDate: string | null;
  distance: number;
}) {
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      source: 'calculator',
      name: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      fromCity: lead.fromCity,
      fromZip: lead.fromZip,
      toCity: lead.toCity,
      moveSize: lead.moveSize,
      moveDate: lead.moveDate || 'Flexible',
      distance: String(lead.distance),
      submittedAt: new Date().toLocaleString(),
    }),
  });
}

export async function submitAvailabilityLead(lead: {
  zip: string;
  location: string;
  moveDate: string;
  phone: string;
}) {
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      source: 'availability',
      zip: lead.zip,
      location: lead.location,
      moveDate: lead.moveDate,
      phone: lead.phone,
      submittedAt: new Date().toLocaleString(),
    }),
  });
}
