import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="flex h-[60px] items-center justify-center border-t">
      <p>
        Made with 💙 by &nbsp;
        <a
          href="https://indranilhalder.in"
          className="text-primary hover:underline"
        >
          Indranil Halder
        </a>
        &nbsp; &copy; 2025
      </p>
    </footer>
  );
};

export default Footer;
