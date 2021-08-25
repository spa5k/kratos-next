import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import { InputHTMLAttributes } from "react";
import { API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const LoginPage = ({ flowData }: { flowData: SelfServiceLoginFlow }) => {
  return (
    <div>
      <p style={{ marginBottom: "100px" }}>{JSON.stringify(flowData)}</p>
      <div>
        <p>Sign in</p>
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

          <input id="identifier" type="text" name="identifier" required />
          <input name="password" type="password" id="password" required />
          <button type="submit">Sign In</button>
          <input name="csrf_token" id="csrf_token" type="hidden" required />
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
        destination: `${API_URL}/self-service/login/browser`,
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
