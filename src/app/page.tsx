import { FC } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const HomePage: FC = () => {
  return (
    <div className="container mx-auto h-[calc(100vh-135px)]">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="mb-2 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text pb-2 text-center text-6xl font-extrabold text-transparent">
          Image Text Composer
        </h1>
        <p className="text-muted-foreground text-center text-xl">
          Upload your favorite images and personalize them with custom text in
          just a few clicks. Create stunning, share-worthy visuals effortlessly
          with our Image Text Composer app.
        </p>
        <Link href="/editor" className={buttonVariants({ size: "lg" })}>
          <span>Edit Images</span>
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
