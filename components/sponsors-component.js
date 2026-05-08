class FausionSponsors extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'root', 'working-images'];
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this._load();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this._load();
  }

  _load() {
    const src = this.getAttribute('src') || 'data/sponsors-2026.json';
    fetch(src)
      .then(r => r.json())
      .then(sponsors => this._render(sponsors));
  }

  _render(sponsors) {
    const root          = this.getAttribute('root') || './';
    const workingImages = JSON.parse(this.getAttribute('working-images') || '[]');

    const workingImagesHTML = workingImages.length ? `
      <div class="working-images">
        ${workingImages.map(img => `
        <div class="working-image-container">
          <img src="${img.src}" alt="${img.alt || ''}" class="working-image">
          <div class="image-subtitle">${img.caption || ''}</div>
        </div>`).join('')}
      </div>` : '';

    const cards = sponsors.map(s => `
      <a href="${s.url}" target="_blank" class="sponsor-card">
        <img src="${root}${s.logo}" alt="${s.name} Logo" class="sponsor-logo">
        <div class="sponsor-info">
          <h3>${s.name}</h3>
          <p>${s.description}</p>
        </div>
      </a>
    `).join('');

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${root}sponsors.css">

      <a href="https://megware.de" target="_blank" class="main-sponsor">
        <img src="${root}assets/logos/megware.svg" alt="MEGWARE Logo" class="main-sponsor-logo">
        <div class="sponsor-info">
          <h3>MEGWARE</h3>
          <p>Our main sponsor, providing us with cutting-edge hardware solutions and technical expertise.</p>
        </div>
      </a>

      <div class="hero-text">
        <p>MEGWARE generously supports us with cutting-edge hardware: three compute nodes equipped with four NVIDIA H200 GPUs each. We recently had the incredible opportunity to visit MEGWARE in Chemnitz for an insightful two-day field trip. We were warmly welcomed by the cluster experts with a tour of their facilities, including benchmark clusters, development centers, and a chance to meet brilliant minds from different departments. Day two was packed with deep dives into energy-efficient architectures, exploring solutions to stay within power budgets while maximizing performance.</p>
      </div>

      ${workingImagesHTML}

      ${sponsors.length ? `<h2>More Partners</h2><div class="sponsor-cards">${cards}</div>` : ''}
    `;

    const fadeElements = this.shadowRoot.querySelectorAll('.sponsor-card, .working-image-container');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
  }
}

customElements.define('fausion-sponsors', FausionSponsors);
