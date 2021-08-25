import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { GetServerSideProps } from "next";
import { applyServerSideCookie } from "next-universal-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const LoginPage = ({ cookie }: { cookie: string }) => {
  const router = useRouter();
  const [flowData, setFlowData] = useState<SelfServiceLoginFlow>();
  const [flowId, setFlowId] = useState<string>();

  useEffect(() => {
    if (router.isReady) {
      const { flow } = router.query;
      if (flow) {
        setFlowId(flow.toString());
      }

      if (!flow) {
        router.replace(`${API_URL}/self-service/login/browser`);
        return;
      }
    }
  });

  console.log("cookie", cookie);
  // logs something like this - aHR0cDovLzEyNy4wLjAuMTo0NDMzLw_csrf_token=MluxUUZ3PBn2N+at+XwsSiRyDQMlq4KCUDhxl9ouBP0=

  useEffect(() => {
    if (flowId && cookie) {
      console.log("flow id", flowId);
      kratos
        .getSelfServiceLoginFlow(flowId, cookie)
        .then(({ data: flow }) => {
          setFlowData(flow);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [flowId]);

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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  applyServerSideCookie(req, res);
  // Parse
  const allCookie = req.headers.cookie;
  let cookie: string = null;
  if (allCookie) {
    cookie = allCookie;
  }

  return {
    props: { cookie },
  };
};

export default LoginPage;
