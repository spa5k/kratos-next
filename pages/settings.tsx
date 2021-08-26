import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import Link from "next/dist/client/link";
import dynamic from "next/dynamic";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { KRATOS_API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const JsonView = dynamic(import("react-json-view"), { ssr: false });

const SettingsPage = ({ flowData }: { flowData: SelfServiceSettingsFlow }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // This useEffect is to add the values in their respective fields
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

            {/* This button will update the email, first and last name  */}
            <button name="method" type="submit" value="profile">
              Update Profile
            </button>
            <br />
            <h2>Change Password?</h2>

            <label>
              <span>New Password</span>
              <input name="password" type="password" placeholder="Password" />
            </label>

            {/* This button is used to upadate the password  */}
            <button name="method" type="submit" value="password">
              Update Password
            </button>
          </form>
        )}
      </div>

      {flowData.ui.messages && (
        <>
          <h3>Errors</h3>
          <JsonView
            src={flowData.ui.messages}
            style={{ fontSize: "20px", marginTop: "30px" }}
            enableClipboard={false}
            displayDataTypes={false}
          />
        </>
      )}

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

// Server side props for getting the Cookies and flow id etc
export async function getServerSideProps(context: NextPageContext) {
  const allCookies = context.req.headers.cookie;
  const flowId = context.query.flow;

  if (!flowId) {
    return {
      redirect: {
        destination: `${KRATOS_API_URL}/self-service/settings/browser`,
        // This url needs to change according to the work you are intending it to do
      },
    };
  }

  let flowData: SelfServiceSettingsFlow | void;

  if (allCookies) {
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
