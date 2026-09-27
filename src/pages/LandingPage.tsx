import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main id="main">
      <div className="stripe" />
      <section className="hero">
        <div>
          <p className="kicker">Field log · Version 1</p>
          <h1>The day on the job, written once and kept.</h1>
          <p className="lede">
            Construction Reports is the daily jobsite log for superintendents.
            Crew counts, weather, work in place, delays, and safety — filed
            before the trucks leave the gate.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/app">
              Open the sample jobs
            </Link>
            <a className="btn secondary" href="#product">
              See what gets captured
            </a>
          </div>
        </div>
        <article className="hero-card" aria-label="Sample daily report">
          <header>
            <div>
              <strong>Rio Verde Medical Pavilion</strong>
              <div className="meta">CR-2604 · Scottsdale, AZ</div>
            </div>
            <span className="status submitted">Submitted</span>
          </header>
          <p className="meta">Sat, Sep 26, 2026 · Clear · 98° / 74°</p>
          <p>
            Placed 86 CY of slab-on-grade at Level 1 west wing. Formwork
            stripped at east stair core. Underground electrical rough-in
            completed through gridline D.
          </p>
          <p className="meta">Crew on site: 23 · Maya Ortiz</p>
        </article>
      </section>

      <section className="section" id="product">
        <p className="kicker">What the book keeps</p>
        <h2>A report the office can trust.</h2>
        <p className="lede">
          Built for commercial work in the Southwest. Fast enough for the
          pickup, complete enough for the owner meeting.
        </p>
        <div className="cards" style={{ marginTop: 28 }}>
          <article className="card">
            <h3>Crew and trades</h3>
            <p className="muted">
              Headcount by trade so labor, billing, and look-aheads stay
              honest.
            </p>
          </article>
          <article className="card">
            <h3>Work in place</h3>
            <p className="muted">
              What moved today, in the superintendent's own words — not a
              checklist nobody reads.
            </p>
          </article>
          <article className="card">
            <h3>Delays and safety</h3>
            <p className="muted">
              Weather, trucks, inspectors, near misses. The record you wish
              you had six months later.
            </p>
          </article>
        </div>
      </section>

      <section className="section alt" id="how">
        <div className="inner">
          <p className="kicker">How it works</p>
          <h2>Three jobs. Real reports. No login theater.</h2>
          <p className="lede muted">
            Version 1 ships with seeded Southwest projects so you can file a
            report in the first minute. Everything stays in this browser until
            you reset the demo.
          </p>
          <div className="grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <div className="meta">01</div>
              <h3>Pick a job</h3>
              <p className="muted">
                Medical, highway, or multifamily punch. Each job already has a
                superintendent and a number.
              </p>
            </article>
            <article className="card">
              <div className="meta">02</div>
              <h3>Write the day</h3>
              <p className="muted">
                Weather, crew, work, delays, materials, visitors. Save a draft
                or submit it.
              </p>
            </article>
            <article className="card">
              <div className="meta">03</div>
              <h3>Keep the book</h3>
              <p className="muted">
                Search every report, open a printable sheet, or restore the
                sample set when you want a clean slate.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <p className="kicker">Pricing</p>
        <h2>Simple enough for a first job.</h2>
        <div className="grid-3" style={{ marginTop: 28 }}>
          <article className="card">
            <div className="meta">Starter</div>
            <div className="price">Free</div>
            <p className="muted">This version 1 demo. One browser, three jobs, unlimited practice reports.</p>
          </article>
          <article className="card">
            <div className="meta">Crew</div>
            <div className="price">$29</div>
            <p className="muted">Per superintendent / month when accounts and cloud sync land.</p>
            <ul className="list muted">
              <li>Shared project book</li>
              <li>Photo attachments</li>
              <li>Email a PDF at 4:00</li>
            </ul>
          </article>
          <article className="card">
            <div className="meta">Company</div>
            <div className="price">Talk</div>
            <p className="muted">Multi-job rollup for GCs who want every super on the same page.</p>
          </article>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>File today's report.</h2>
          <p className="muted">The sample book is already open. Add a line and see it stick.</p>
        </div>
        <Link className="btn" to="/app/reports/new" style={{ background: "var(--amber)", color: "var(--ink)" }}>
          Write a daily
        </Link>
      </section>
    </main>
  );
}
