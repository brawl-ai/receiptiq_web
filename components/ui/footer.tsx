import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const footerLinks = [
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Privacy",
    href: "/docs/ReceiptIQ Terms and Conditions.pdf",
  },
  {
    title: "Contact",
    href: "mailto:peter@receiptiq.co",
  },
];

const Footer01 = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-stone-900">
      <div className="grow bg-muted" />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <div className="py-12 flex flex-col justify-start items-center text-muted-foreground dark:text-white">
            {/* Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="64" viewBox="0 0 220 64" className="text-muted-foreground dark:text-white">
              {/* Rounded square on the left */}
              <rect x="2" y="2" width="60" height="60" rx="5" stroke="currentColor" strokeWidth="2" fill="transparent" />
              {/* Squiggly line in the center */}
              <path d="M12 32 L16 28 L20 36 L24 28 L28 36 L32 28 L36 36 L40 28 L44 36 L48 28 L52 36 L55 32" stroke="currentColor" strokeWidth="3" fill="none" />
              {/* Text next to it */}
              <text x="75" y="40" fontFamily="Arial, sans-serif" fill="currentColor" fontSize="28" fontWeight={"bold"}>
                ReceiptIQ
              </text>
            </svg>

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground font-medium"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                ReceiptIQ
              </Link>
              . All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer01;
