import Link from "next/link";

const IndexPage = () => (
  <div title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link href="/login">
        <a>Login</a>
      </Link>
      <br />
      <Link href="/me">
        <a>Dashboard</a>
      </Link>
      <br />
      <Link href="/register">
        <a>Register</a>
      </Link>
      <br />
      <Link href="/recovery">
        <a>Recovery</a>
      </Link>
    </div>
  </div>
);

export default IndexPage;
