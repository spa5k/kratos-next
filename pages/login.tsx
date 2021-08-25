import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const LoginPage = ({ cookie, flowId }: { cookie: string; flowId: string }) => {
  const router = useRouter();
  const [flowData, setFlowData] = useState<SelfServiceLoginFlow>();
  // const [flowId, setFlowId] = useState<string>();

  // useEffect(() => {
  //   if (router.isReady) {
  //     const { flow } = router.query;
  //     if (flow) {
  //       setFlowId(flow.toString());
  //     }

  //     if (!flow) {
  //       router.push(
  //         `${API_URL}/self-service/login/browser`,
  //         {
  //           slashes: false,
  //         },
  //         { shallow: true }
  //       );
  //       return;
  //     }
  //   }
  // });

  console.log("cookie 2", cookie);
  console.log("flow 2", flowId);
  // logs something like this - aHR0cDovLzEyNy4wLjAuMTo0NDMzLw_csrf_token=MluxUUZ3PBn2N+at+XwsSiRyDQMlq4KCUDhxl9ouBP0=

  useEffect(() => {
    if (flowId && cookie) {
      kratos
        .getSelfServiceLoginFlow(flowId, cookie)
        .then(({ data: flow }) => {
          setFlowData(flow);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  });

  return (
    <div>
      <p>{JSON.stringify(flowData)}</p>
      <div>
        <p>Sign in</p>
        {/* <form method="POST" action={flowData.ui.action}>
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
        </form> */}
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
  console.log("cookie 1", allCookies);
  console.log("flow 1", flowId);

  return {
    props: {
      cookie: allCookies ? allCookies : null,
      flowId,
    },
  };
}

export default LoginPage;
