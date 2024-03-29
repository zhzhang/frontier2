const clientIdentity =
  "projects/97350118469/secrets/demo-client-identity/versions/latest";
const pem = "projects/97350118469/secrets/demo-server-ca-pem/versions/latest";

// Imports the Secret Manager library
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// Instantiates a client
const client = new SecretManagerServiceClient();
const fs = require("fs");

async function accessSecretVersion() {
  let [version] = await client.accessSecretVersion({
    name: clientIdentity,
  });
  let payload = version.payload.data;
  fs.writeFileSync("prisma/client-identity.p12", version.payload.data);

  [version] = await client.accessSecretVersion({
    name: pem,
  });
  payload = version.payload.data;
  fs.writeFileSync("prisma/server-ca.pem", version.payload.data);
}

accessSecretVersion();
