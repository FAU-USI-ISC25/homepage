class FausinHeader extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    const year = this.getAttribute('year') || '2026';
    const root = this.getAttribute('root') || './';

    const editions = [
      { year: '2026', path: `${root}editions/2026/index.html` },
      { year: '2025', path: `${root}editions/2025/index.html` },
    ];

    const logoHref = editions.find(e => e.year === year)?.path ?? `${root}index.html`;

    const optionsHTML = editions
      .map(e => `<a href="${e.path}" class="year-option${e.year === year ? ' active' : ''}">${e.year}</a>`)
      .join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }

        header {
          position: fixed;
          top: 0; left: 0; right: 0;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 1000;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: padding 0.3s ease;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-sizing: border-box;
        }
        header.scrolled { padding: 0.5rem 2rem; }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          color: inherit;
        }
        .logo {
          height: 40px;
          transition: height 0.3s ease;
        }
        header.scrolled .logo { height: 30px; }

        h1 {
          font-size: 1.5rem;
          color: #2C2E35;
          margin: 0;
          transition: font-size 0.3s ease;
        }
        header.scrolled h1 { font-size: 1.2rem; }

        .year-dropdown {
          position: relative;
          cursor: pointer;
        }
        .year-current {
          padding: 0.4rem 0.8rem;
          border: 1px solid #2C2E35;
          border-radius: 4px;
          color: #2C2E35;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          user-select: none;
          white-space: nowrap;
        }
        .year-options {
          position: absolute;
          top: 100%;
          right: 0;
          padding-top: 4px;
          background: white;
          border: 1px solid #2C2E35;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 1001;
          min-width: 100%;
        }
        .year-dropdown:hover .year-options {
          opacity: 1;
          pointer-events: auto;
        }
        .year-option {
          display: block;
          padding: 0.4rem 0.8rem;
          color: #2C2E35;
          text-decoration: none;
          font-weight: 600;
          white-space: nowrap;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .year-option:hover { background: #04316A; color: white; }
        .year-option.active { background: #2C2E35; color: white; }

        @media (max-width: 768px) {
          header { padding: 1rem; }
          header.scrolled { padding: 0.5rem 1rem; }
          h1 { font-size: 1.2rem; }
          .logo { height: 30px; }
        }
      </style>
      <header>
        <a href="${logoHref}" class="logo-link">
          <img src="${root}assets/logos/fausion.svg" alt="FAUSION Logo" class="logo">
          <h1>FAUSION</h1>
        </a>
        <div class="year-dropdown">
          <span class="year-current">${year} &#9662;</span>
          <div class="year-options">${optionsHTML}</div>
        </div>
      </header>
    `;

    const header = this.shadowRoot.querySelector('header');
    this._onScroll = () => {
      header.classList.toggle('scrolled', window.pageYOffset > 50);
    };
    window.addEventListener('scroll', this._onScroll);
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this._onScroll);
  }
}

customElements.define('fausion-header', FausinHeader);
