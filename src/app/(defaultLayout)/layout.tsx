import Footer from "@/components/Common/Footer/Footer";
import Navbar from "@/components/Common/Navbar/Navbar";
import { getMe } from "@/src/services";

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();

  console.log("user in home", user);

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default CommonLayout;
