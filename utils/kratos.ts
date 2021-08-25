import { Configuration, V0alpha1Api } from "@ory/kratos-client";
import { API_URL } from "./config";

const config = new Configuration({ basePath: API_URL });
export const kratos = new V0alpha1Api(config);
