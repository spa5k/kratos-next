import { SelfServiceRegistrationFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import { InputHTMLAttributes } from "react";
import { API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const RegisterPage = ({
  flowData,
}: {
  flowData: SelfServiceRegistrationFlow;
}) => {
  console.log(flowData);

  return (
    <div>
      <p style={{ marginBottom: "100px" }}>
        {JSON.stringify(flowData.ui.messages)}
      </p>
      <div style={{ display: "flex" }}>
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
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const allCookies = context.req.headers.cookie;
  const flowId = context.query.flow;

  if (!flowId) {
    return {
      redirect: {
        destination: `${API_URL}/self-service/registration/browser`,
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
