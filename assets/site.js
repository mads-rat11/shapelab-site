{
  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (btn && nav) {
    const set = (open) => {
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => set(!nav.classList.contains('open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }

  // Forms: sent by email through FormSubmit (https://formsubmit.co).
  // The first submission sends a one-time activation email to the address below.
  const INBOX = 'hello@shapelab.me';
  const ENDPOINT = 'https://formsubmit.co/ajax/' + INBOX;

  for (const form of document.querySelectorAll('form[data-form]')) {
    const msg = form.querySelector('.form-msg');
    const done = document.getElementById(form.dataset.done);
    const submit = form.querySelector('button[type=submit]');
    const say = (text, err) => { msg.textContent = text; msg.classList.toggle('err', !!err); };

    // Prefill interest from ?interest= on the demo page
    try {
      const want = new URLSearchParams(location.search).get('interest');
      if (want) { const box = form.querySelector('input[value="' + CSS.escape(want) + '"]'); if (box) box.checked = true; }
    } catch (e) {}

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); say('Please fill in the required fields.', true); return; }
      if (form.querySelector('.hp input').value) return; // bot trap

      const data = {};
      for (const [k, v] of new FormData(form)) {
        if (k === '_honey') continue;
        data[k] = data[k] ? data[k] + ', ' + v : v;
      }
      data._subject = form.dataset.subject + (data.company ? ': ' + data.company : '');
      data._template = 'table';

      submit.disabled = true;
      say('Sending...');
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(String(res.status));
        form.hidden = true;
        if (done) { done.hidden = false; done.focus(); }
      } catch (err) {
        submit.disabled = false;
        say('That did not send. Please email us at ' + INBOX + ' and we will reply there.', true);
      }
    });
  }

  // Label stacked table cells for phones
  for (const t of document.querySelectorAll('table.stack')) {
    const heads = [...t.querySelectorAll('thead th')].map((h) => h.textContent);
    for (const r of t.querySelectorAll('tbody tr')) [...r.children].forEach((c, i) => { c.dataset.l = heads[i] || ''; });
  }

  // Footer year
  for (const y of document.querySelectorAll('[data-year]')) y.textContent = new Date().getFullYear();
}
