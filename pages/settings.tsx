import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import Link from "next/dist/client/link";
import dynamic from "next/dynamic";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const DynamicComponent = dynamic(import("react-json-view"), { ssr: false });
const SettingsPage = ({ flowData }: { flowData: SelfServiceSettingsFlow }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    setEmail(flowData.identity.recovery_addresses[0].value);
    setFirstName(flowData.identity.traits.name.first);
    setLastName(flowData.identity.traits.name.last);
  }, [flowData]);

  console.log("flowData", flowData);
  return (
    <div>
      <h1>Settings</h1>
      <Link href="/">
        <a>Homepage</a>
      </Link>
      <br />
      <Link href="me">
        <a>Dashboard</a>
      </Link>
      <div>
        <h2>Profile</h2>
        {flowData && (
          <form
            method="POST"
            action={flowData.ui.action}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "400px",
              justifyContent: "space-around",
              width: "300px",
            }}
          >
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

            <label>
              <span>E-Mail</span>
              <input
                name="traits.email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-Mail"
              />
            </label>

            <label>
              <span>First Name</span>
              <input
                name="traits.name.first"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </label>

            <label>
              <span>Last Name</span>
              <input
                name="traits.name.last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </label>

            <button name="method" type="submit" value="profile">
              Update Profile
            </button>
            <br />
            <h2>Change Password?</h2>

            <label>
              <span>New Password</span>
              <input name="password" type="password" placeholder="Password" />
            </label>

            <button name="method" type="submit" value="password">
              Update Password
            </button>
          </form>
        )}
      </div>
      {flowData.ui.messages && (
        <>
          <h3>Errors</h3>
          <DynamicComponent
            src={flowData.ui.messages}
            style={{ fontSize: "20px", marginTop: "30px" }}
            enableClipboard={false}
            displayDataTypes={false}
          />
        </>
      )}

      {flowData && (
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
        destination: `${API_URL}/self-service/settings/browser`,
      },
    };
  }

  let flowData: SelfServiceSettingsFlow | void;

  if (allCookies && flowId) {
    const data = await kratos
      .getSelfServiceSettingsFlow(flowId.toString(), undefined, allCookies)
      .then(({ data: flow }) => {
        return flow;
      })
      .catch((err) => {
        console.log(err);
      });
    flowData = data;
  }

  return {
    props: {
      flowData: flowData ? flowData : null,
    },
  };
}

export default SettingsPage;

/*
  <fieldset>
    <label>
        <input name="traits.name.first" type="text" value="1231231231" placeholder="First Name">
        <span>First Name</span>
    </label>
    <div class="messages "></div></fieldset>    <fieldset>
    <label>
        <input name="traits.name.last" type="text" value="23123123123123123" placeholder="Last Name">
        <span>Last Name</span>
    </label>
    <div class="messages "></div></fieldset>

    <button name="method" type="submit" value="profile">
  Save
</button>
<hr class="divider">
<p>Password</p>
  <fieldset>
      <label>
          <input name="password" type="password" value="" placeholder="Password">
          <span>Password</span>
      </label>
            <div class="messages "></div>
      </fieldset>
          <button name="method" type="submit" value="password">
    Save
  </button>

*/
