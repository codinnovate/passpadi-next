"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'SF Pro Rounded', system-ui, sans-serif",
          background: "#fff",
          color: "#0b1829",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 700, color: "#2454FF", margin: 0 }}>
            Oops!
          </h1>
          <p style={{ fontSize: "1.125rem", opacity: 0.7, maxWidth: 400, margin: "1rem auto" }}>
            Something unexpected happened. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              background: "#2454FF",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
