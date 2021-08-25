import Link from "next/link";

const IndexPage = () => (
  <div title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </p>
  </div>
);

export default IndexPage;
