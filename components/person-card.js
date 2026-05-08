// Shared fetch — only hits the network once regardless of how many cards are on the page.
let _peoplePromise = null;
function fetchPeople(src) {
  if (!_peoplePromise) {
    _peoplePromise = fetch(src)
      .then(r => r.json())
      .then(data => {
        // Accept either an array [{name, ...}] or an object {"Name": {...}}
        if (Array.isArray(data)) {
          return Object.fromEntries(data.map(p => [p.name, p]));
        }
        return data;
      });
  }
  return _peoplePromise;
}

class PersonCard extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'subtitle', 'bio', 'picture', 'src', 'year', 'root'];
  }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const name = this.getAttribute('name') || '';
    const root = this.getAttribute('root') || './';
    const year = this.getAttribute('year') || '';
    const src  = this.getAttribute('src')  || (year ? `${root}data/${year}.json` : `${root}data/people.json`);

    if (name) {
      fetchPeople(src).then(people => {
        this._personData = people[name] || {};
        this._root = root;
        this.render();
      });
    } else {
      this._root = root;
      this.render();
    }
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.connectedCallback();
  }

  render() {
    const data     = this._personData || {};
    const root     = this._root || this.getAttribute('root') || './';
    const name     = this.getAttribute('name')     || data.name     || '';
    const subtitle = this.getAttribute('subtitle') || data.subtitle || '';
    const bio      = this.getAttribute('bio')      || data.bio      || '';
    const picture  = this.getAttribute('picture')  || (data.picture ? `${root}${data.picture}` : '');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background: #fff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #2C2E35;
          margin-bottom: 1rem;
        }

        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #2C2E35;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 2.5rem;
          color: #fff;
          border: 3px solid #2C2E35;
        }

        .name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2C2E35;
          margin-bottom: 0.2rem;
        }

        .subtitle {
          font-size: 0.85rem;
          font-weight: 600;
          color: #04316A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .bio {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.5;
        }
      </style>

      <div class="card">
        ${picture
          ? `<img class="avatar" src="${picture}" alt="${name}">`
          : `<div class="avatar-placeholder">${name.charAt(0)}</div>`
        }
        ${name     ? `<div class="name">${name}</div>`         : ''}
        ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
        ${bio      ? `<p class="bio">${bio}</p>`               : ''}
      </div>
    `;
  }
}

customElements.define('person-card', PersonCard);
