import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.svg";

const Logo = ({ className = "w-[100px]" }: { className?: string }) => {
  return (
    <Link href="/">
      <Image alt="Passpadi" src={logo} className={className} />
    </Link>
  );
};

export default Logo;
