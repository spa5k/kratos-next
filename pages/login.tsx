import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import dynamic from "next/dynamic";
import { InputHTMLAttributes } from "react";
import { API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const DynamicComponent = dynamic(import("react-json-view"), { ssr: false });
const LoginPage = ({ flowData }: { flowData: SelfServiceLoginFlow }) => {
  console.log(flowData);
  return (
    <div>
      <div>
        <p>Sign in</p>
        {flowData && (
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
              id="password_identifier"
              type="text"
              name="password_identifier"
              required
            />
            <input name="password" type="password" id="password" required />
            <button type="submit" name="method" value="password">
              Sign In
            </button>
            <input name="csrf_token" id="csrf_token" type="hidden" required />
          </form>
        )}
      </div>

      {flowData && typeof window !== "undefined" && (
        <DynamicComponent
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
