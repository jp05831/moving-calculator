const FORM_EMAIL = 'info@movescout.net';
const ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`;

async function submitLead(data: Record<string, string>) {
  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...data,
        _captcha: 'false',
      }),
    });
  } catch {
    // Silently fail — don't block the user experience
  }
}

export async function submitCalcLead(lead: {
  fullName: string;
  email: string;
  phone: string;
  fromCity: string;
  toCity: string;
  moveSize: string;
  moveDate: string | null;
  distance: number;
}) {
  await submitLead({
    _subject: 'New Calculator Lead — Freedom Movers',
    Name: lead.fullName,
    Email: lead.email,
    Phone: lead.phone,
    'Moving From': lead.fromCity,
    'Moving To': lead.toCity,
    'Move Size': lead.moveSize,
    'Move Date': lead.moveDate || 'Flexible',
    'Distance (miles)': String(lead.distance),
    'Submitted At': new Date().toLocaleString(),
  });
}

export async function submitAvailabilityLead(lead: {
  zip: string;
  moveDate: string;
  phone: string;
}) {
  await submitLead({
    _subject: 'New Availability Lead — Freedom Movers',
    'Zip Code': lead.zip,
    'Move Date': lead.moveDate,
    Phone: lead.phone,
    'Submitted At': new Date().toLocaleString(),
  });
}
