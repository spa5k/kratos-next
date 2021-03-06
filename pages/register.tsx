import { SelfServiceRegistrationFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import dynamic from "next/dynamic";
import { InputHTMLAttributes } from "react";
import { KRATOS_API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";
const JsonView = dynamic(import("react-json-view"), { ssr: false });

const RegisterPage = ({
  flowData,
}: {
  flowData: SelfServiceRegistrationFlow;
}) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Register</h1>
        <form method="POST" action={flowData.ui.action}>
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
            type="email"
            id="traits.email"
            name="traits.email"
            required
            placeholder="email"
          />
          <input
            type="text"
            id="traits.name.first"
            name="traits.name.first"
            required
            placeholder="first"
          />
          <input
            type="text"
            id="traits.name.last"
            name="traits.name.last"
            required
            placeholder="last"
          />
          <input
            name="password"
            type="password"
            id="password"
            required
            placeholder="password"
          />
          <button type="submit" name="method" value="password">
            Register
          </button>

          <button type="submit" name="provider" value="github">
            Signup with github
          </button>
        </form>
      </div>
      <JsonView
        src={flowData}
        style={{ fontSize: "20px" }}
        enableClipboard={false}
        displayDataTypes={false}
      />
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const allCookies = context.req.headers.cookie;
  const flowId = context.query.flow;

  if (!flowId) {
    return {
      redirect: {
        destination: `${KRATOS_API_URL}/self-service/registration/browser`,
      },
    };
  }

  let flowData: SelfServiceRegistrationFlow | void;

  if (allCookies && flowId) {
    const data = await kratos
      .getSelfServiceRegistrationFlow(flowId.toString(), allCookies)
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

export default RegisterPage;
