import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";

const Navbar: FC = () => {
  return (
    <nav className="flex h-[75px] items-center border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" width={48} height={48} />
            <p className="text-xl">Image Text Composer</p>
          </Link>
        </div>
        <div>
          <Link href="/editor" className={buttonVariants()}>
            <span>Go to Editor</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
