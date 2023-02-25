import React, { FC } from "react";
import axios from "axios";
import MobxReactForm from "mobx-react-form";
import { ChevronRight } from "react-feather";
import { observer } from "mobx-react";
import Link from "next/link";

import { useNotificationStore } from "lib/stores/NotificationStore";
import { defaultOptions, defaultPlugins } from "lib/form";

const newsletterSubForm = new MobxReactForm(
  {
    fields: {
      email: {
        value: "",
        rules: "required|email",
      },
    },
  },
  {
    plugins: defaultPlugins,
    options: defaultOptions,
  },
);

const FooterNewsletterSub: FC<{ title: string }> = observer(({ title }) => {
  const notificationStore = useNotificationStore();
  const formField = newsletterSubForm.$("email");

  const invalid = formField.showError && !formField.isValid;

  const subscribe = async (email: string) => {
    try {
      await axios.post("https://emails.zulu.pm/app-subscribe", { email });

      notificationStore.pushNotification(
        "Email sent successfully! We'll be in touch soon.",
        { type: "Success" },
      );
    } catch {
      notificationStore.pushNotification(
        "Something went wrong, please try again.",
        { type: "Error" },
      );
    }
  };

  return (
    <form
      className="w-zul-240 h-zul-100 flex flex-col justify-between flex-shrink flex-grow-0"
      onSubmit={(e) => {
        e.preventDefault();
        if (invalid) {
          return;
        }
        subscribe(formField.value);
      }}
    >
      <h3 className="text-zul-16-150 font-bold h-zul-38 mb-zul-5">{title}</h3>
      <div className="flex items-center justify-between h-zul-40 mb-auto w-full">
        <input
          value={newsletterSubForm.$("email").value}
          onChange={newsletterSubForm.$("email").onChange}
          className={`h-full rounded-zul-100 text-sky-600 p-2 text-zul-12-120 bg-sky-200 dark:bg-black focus:outline-none flex-grow max-w-zul-184 border-1 ${
            invalid ? "border-vermilion" : "border-none"
          }`}
        />
        <button
          type="submit"
          className={
            "h-full w-zul-40 flex-shrink-0 rounded-full center bg-sky-600 text-white dark:bg-sky-600 dark:text-black " +
            (invalid ? "cursor-default" : "cursor-pointer")
          }
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </form>
  );
});

interface FooterMenuProps {
  title: string;
  links: { text: string; href: string }[];
  className?: string;
}

const FooterMenu: FC<FooterMenuProps> = observer(
  ({ title, links, className = "" }) => {
    return (
      <div
        className={`flex-zul-basis-164 h-zul-100 flex flex-col justify-between lg:mr-zul-10
          md:mr-zul-5 lg:flex-shrink-0 flex-shrink flex-grow ${className}
          `}
      >
        <h3 className="text-zul-16-150 font-bold h-zul-38 mb-zul-5">{title}</h3>
        <div className="text-zul-12-150 flex flex-col text-sky-600  mb-auto">
          {links.map(({ text, href }, idx) => {
            return (
              <Link href={href} key={`footerMenuLink${idx}`} target="_blank">
                <span className="hover:text-white">{text}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  },
);

const Footer = observer(() => {
  return (
    <div className="mt-auto  text-black bg-white dark:bg-sky-1000 dark:text-white border-t-1 border-border-light dark:border-border-dark px-zul-32">
      <div className="mx-auto max-w-zul-1100 flex flex-wrap pb-zul-25 pt-zul-30">
        <FooterMenu
          title="General"
          links={[
            { text: "Website", href: "https://zulu.pm" },
            { text: "Blog", href: "https://blog.zulu.pm" },
            {
              text: "Privacy Policy",
              href: "https://docs.google.com/document/d/e/2PACX-1vSzOpsuAJ3CKHNeitx4um2k-D9m7dJzJ0ZyXe0buWQXm_MWUoaNujCYwnvp4P8Ia70-59JxDraWUebT/pub",
            },
            {
              text: "Terms of Use",
              href: "https://docs.google.com/document/d/e/2PACX-1vQuMdjqEVt7lPwnGimAQd9lJufSwCJ6S_kSJlL_wYLTOlJnIDcnzOaunXRVpOHIrw/pub",
            },
          ]}
        />
        <FooterMenu
          title="Technology"
          links={[
            { text: "Documentation", href: "https://docs.zulu.pm" },
            { text: "Github", href: "https://github.com/zulupm" },
            {
              text: "Polkadot-JS Apps",
              href: "https://polkadot.js.org/apps/?rpc=wss://bsr.zulu.pm",
            },
          ]}
        />
        <FooterMenu
          title="Community"
          links={[
            { text: "Discord", href: "https://discord.gg/xv8HuA4s8v" },
            { text: "Telegram", href: "https://t.me/zulu_official" },
            { text: "Twitter", href: "https://twitter.com/ZuluPM" },
          ]}
          className="mb-zul-10"
        />
        <div className="w-full text-zul-10-150 text-black dark:text-white  mt-zul-5 mb-zul-10">
          Please be advised that Equipoise Corp. d/b/a Zulu is registered
          under the laws of Panama, and Zulu has not sought licensing with
          any other regulatory authority of any country or jurisdiction, nor has
          any such regulatory authority passed upon or endorsed the merits of
          the financial products offered by Zulu. Therefore, Zulu does
          not accept clients from the United States and other similar
          jurisdictions where regulations prohibit Zulu from offering its
          financial products (“Regulated Jurisdictions”). While this website may
          be accessed worldwide, the information provided is only intended for
          use by any person in any country where such use would not be contrary
          to local law or regulation. Browsers from Regulated Jurisdictions are
          specifically prohibited from using this site.
        </div>
        <FooterNewsletterSub title="Stay up to Date" />
        <div className="w-full text-zul-10-150 text-black dark:text-white font-sans mt-zul-5">
          © 2022 Equipoise Corp.
        </div>
      </div>
    </div>
  );
});

export default Footer;