import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import Link from "next/dist/client/link";
import dynamic from "next/dynamic";
import { InputHTMLAttributes } from "react";
import { KRATOS_API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const JsonView = dynamic(import("react-json-view"), { ssr: false });
const LoginPage = ({ flowData }: { flowData: SelfServiceLoginFlow }) => {
  console.log(flowData);
  return (
    <div>
      <div>
        <p>Sign in</p>
        {flowData && (
          <form method="POST" action={flowData.ui.action}>
            {/* This Adds a hidden input for CSRF Token  */}
            {flowData.ui.nodes
              .filter((node) => node.group === "default")
              .map((node) => {
                return (
                  <input
                    {...(node.attributes as InputHTMLAttributes<HTMLInputElement>)}
                    key="csrf_token"
                  />
                );
              })}

            <input
              id="password_identifier"
              type="text"
              name="password_identifier"
            />
            <input name="password" type="password" id="password" />
            <button type="submit" name="method" value="password">
              Sign In
            </button>
            <br />
            <button type="submit" name="provider" value="github">
              Login with github
            </button>
          </form>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link href="/register">
            <a>Register</a>
          </Link>
          <br />
          <Link href="/recovery">
            <a>Recovery</a>
          </Link>
        </div>
      </div>

      {flowData && (
        <JsonView
          src={flowData}
          style={{ fontSize: "20px", marginTop: "30px" }}
          enableClipboard={false}
          displayDataTypes={false}
        />
      )}
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const allCookies = context.req.headers.cookie;
  const flowId = context.query.flow;

  const id = context.query.id;

  if (!flowId) {
    return {
      redirect: {
        destination: `${KRATOS_API_URL}/self-service/login/browser`,
      },
    };
  }

  let flowData: SelfServiceLoginFlow | void;

  if (allCookies && flowId) {
    const data = await kratos
      .getSelfServiceLoginFlow(flowId.toString(), allCookies)
      .then(({ data: flow }) => {
        return flow;
      })
      .catch((err) => {
        console.log("err", err);
      });
    flowData = data;
  }

  return {
    props: {
      flowData: flowData ? flowData : null,
    },
  };
}

export default LoginPage;
