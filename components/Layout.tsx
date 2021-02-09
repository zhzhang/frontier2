import Navigation from "./Navigation";

const Layout = (props) => {
  if (typeof window === "undefined") {
    return <div>Loading ...</div>;
  }
  return (
    <>
      <Navigation />
      <div className="layout">{props.children}</div>
    </>
  );
};

export default Layout;
