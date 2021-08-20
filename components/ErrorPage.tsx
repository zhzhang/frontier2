import Error from "@/components/Error";
import Layout from "@/components/Layout";

export default function ErrorPage(props) {
  return (
    <Layout>
      <Error {...props} />
    </Layout>
  );
}
