export function App() {
  return (
    <main
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        minHeight: "100vh",
        margin: 0,
        background:
          "linear-gradient(135deg, rgb(245, 239, 230) 0%, rgb(232, 244, 250) 100%)",
        color: "#18222d",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gap: 24,
        }}
      >
        <section>
          <p style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Prism
          </p>
          <h1 style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", margin: 0 }}>
            Visual intelligence for the Tracium ecosystem.
          </h1>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.6, maxWidth: 760 }}>
            This app will render runtime timelines from Tracium Engine and
            repository graphs from Atlas through Nerva.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <Card
            title="Runtime Track"
            body="Tracium Engine emits UEF timelines for stack, heap, references, and execution steps."
          />
          <Card
            title="Repo Track"
            body="Atlas emits UGF graphs for modules, symbols, dependencies, and call paths."
          />
          <Card
            title="Platform Layer"
            body="Nerva, Vector, and Pulse unify access without collapsing the engines together."
          />
        </section>
      </div>
    </main>
  );
}

function Card(props: { title: string; body: string }) {
  return (
    <article
      style={{
        background: "rgba(255, 255, 255, 0.72)",
        border: "1px solid rgba(24, 34, 45, 0.12)",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 14px 32px rgba(24, 34, 45, 0.08)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>{props.title}</h2>
      <p style={{ marginBottom: 0, lineHeight: 1.6 }}>{props.body}</p>
    </article>
  );
}
