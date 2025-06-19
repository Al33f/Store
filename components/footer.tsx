import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="wrapper py-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
