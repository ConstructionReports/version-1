import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main id="main">
      <div className="stripe" />
      <section className="hero">
        <div>
          <p className="kicker">Construction management · small bench</p>
          <h1>Job Trackers the office and the field can share.</h1>
          <p className="lede">
            A compact book for a few managers: file the day, assign employee
            profiles, leave notes for each other, sign the record, and move the
            same data through Excel.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/app">
              Open Job Trackers
            </Link>
            <Link className="btn secondary" to="/app/import-export">
              Import / Export files
            </Link>
          </div>
        </div>
        <article className="hero-card" aria-label="Sample job tracker">
          <header>
            <div>
              <strong>Rio Verde Medical Pavilion</strong>
              <div className="meta">CR-2604 · Scottsdale, AZ</div>
            </div>
            <span className="status signed">Signed</span>
          </header>
          <p className="meta">Sat, Sep 26, 2026 · 05:30–16:45 · Clear 98° / 74°</p>
          <p>
            Placed 86 CY of slab-on-grade at Level 1 west wing. Heat rest cycle
            logged. Ready-mix delay 1.2 hours.
          </p>
          <p className="meta">Assigned: Ortiz, Herrera, Cho, Wright · Maya signed</p>
        </article>
      </section>

      <section className="section" id="product">
        <p className="kicker">What the book keeps</p>
        <h2>Standard jobsite fields, our own shape.</h2>
        <p className="lede">
          Drawn from how Raken, Procore, Contractor Foreman, and common GC Excel
          dailies collect the day — then kept small enough for a handful of
          managers.
        </p>
        <div className="cards" style={{ marginTop: 28 }}>
          <article className="card">
            <h3>Job Trackers</h3>
            <p className="muted">
              Date and time, job name and number, weather, work, delays,
              visitors, equipment, materials, inspections, and non-standard
              safety items.
            </p>
          </article>
          <article className="card">
            <h3>People</h3>
            <p className="muted">
              Profiles with trade, role, phone, hire date, emergency contact,
              and certs. Drop them onto a tracker when they are on the job.
            </p>
          </article>
          <article className="card">
            <h3>Excel + e-sign</h3>
            <p className="muted">
              Import and export .xlsx with stable headers. Signature pad and
              intent text sit on every tracker, ready for a later provider.
            </p>
          </article>
        </div>
      </section>

      <section className="section alt" id="how">
        <div className="inner">
          <p className="kicker">How the bench works</p>
          <h2>Make, save, collaborate, export.</h2>
          <div className="grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <div className="meta">01</div>
              <h3>Switch manager</h3>
              <p className="muted">
                Ortiz, Keene, or Shah. Notes stay on the tracker so the next
                person sees them.
              </p>
            </article>
            <article className="card">
              <div className="meta">02</div>
              <h3>File or import</h3>
              <p className="muted">
                Write a tracker, or bring a sheet whose columns already match
                job_number, log_date, and work_completed.
              </p>
            </article>
            <article className="card">
              <div className="meta">03</div>
              <h3>Sign the day</h3>
              <p className="muted">
                Typed or drawn signature, timestamp, role, and a stored intent
                sentence.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Open the sample book.</h2>
          <p className="muted">Three jobs, eight people, and live Excel headers.</p>
        </div>
        <Link className="btn" to="/app" style={{ background: "var(--amber)", color: "var(--ink)" }}>
          Job Trackers
        </Link>
      </section>
    </main>
  );
}
