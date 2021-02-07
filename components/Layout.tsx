import Navigation from "./Navigation";
import { Auth0Provider } from "@auth0/auth0-react";

const Layout = (props) => (
  <Auth0Provider
    domain={"frontier-pub.auth0.com"}
    clientId={"XbugREYAulLjVqyQCE9FzkEW0ekqimE1"}
    redirectUri={"http://localhost:3000/"}
  >
    <Navigation />
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        background: rgba(0, 0, 0, 0.05);
      }

      input,
      textarea {
        font-size: 16px;
      }

      button {
        cursor: pointer;
      }
    `}</style>
    <style jsx>{`
      .layout {
        padding: 0 2rem;
      }
    `}</style>
  </Auth0Provider>
);

export default Layout;
