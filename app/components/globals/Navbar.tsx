"use client";

import { Disclosure, Menu, Transition } from "@headlessui/react";
import variables from "@variables/variables.module.scss";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import process from "process";
import { Fragment, memo, useState } from "react";

const Avatar = dynamic(() => import("@components/library/Avatar"), {
  ssr: true,
});

const Button = dynamic(() => import("@components/library/Button"), {
  ssr: true,
});
const Icon = dynamic(() => import("@components/library/Icon"), {
  ssr: true,
});
const ModalBlank = dynamic(() => import("@components/library/ModalBlank"), {
  ssr: true,
});
const TextField = dynamic(() => import("@library/form/TextField"), {
  ssr: true,
});
// const bdLogoTitleAndAria = process.env.NEXT_PUBLIC_BD_GOV_LOGO_TITLE ?? "";
const dghsLogoTitleAndAria = process.env.NEXT_PUBLIC_DGHS_LOGO_TITLE ?? "";
const misDGHSLogoTitle = process.env.NEXT_PUBLIC_DG_MIS_LOGO_TITLE ?? "";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Signs out of the app if the provided pathname includes a '#' character.
 *
 * @param {String} pathname - The pathname to check for a '#' character.
 * @return {Promise<void>} - A promise that resolves when the sign out process is complete.
 */
async function signOutOfApp(pathname: String) {
  if (pathname.includes("#")) {
    await signOut({
      callbackUrl: "/login",
    });
  }
}

const companies = [
  {
    name: "Home",
    description: "Shared Health Dashboard by MIS, DGHS",
    href: "/",
    icon: "heart",
  },
];

const navigation = {
  links: [
    {
      name: "Search Patient",
      href: "/admin/patient",
    },
  ],
};

const userDropdown = {
  links: [
    {
      name: "Logout",
      href: "#",
      isActive: false,
    },
  ],
};

export interface NavbarProps {
  currentLocation?: string;
}

const Navbar = memo(function Navbar({
  currentLocation = "Dhaka",
}: NavbarProps) {
  const { data: session } = useSession();
  // console.log({ data: session });
  //+ Modal Stuff
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleClose = () => {
    setShowSearchModal(false);
    setShowLocationModal(false);
  };
  const handleSwitchModals = () => {
    setShowSearchModal(true);
    setShowLocationModal(false);
  };

  const router = useRouter();
  const goToSearchResults = () => router.push("/search-results");
  const goToOnboarding = () => router.push("/onboarding");

  /**
   * Handles the search route.
   *
   * @return {void} No return value.
   */
  const handleSearchRoute = () => {
    setShowSearchModal(false);
    setShowLocationModal(false);
    goToSearchResults();
  };
  const handleOnboardingRoute = () => {
    goToOnboarding();
  };

  const pathname = usePathname();

  return (
    <>
      <Disclosure
        as="nav"
        className="navbar fixed inset-x-0 z-40 bg-white shadow-sm"
      >
        {({ open }) => (
          <>
            <div className="2xl:container px-24 py-12">
              <div className="relative flex h-56 justify-between md:h-48">
                <div className="inset-y-0 left-0 flex items-center md:hidden">
                  {/* //+ Mobile menu button */}
                  <Disclosure.Button className="menu-btn inline-flex items-center justify-center rounded-md p-8 text-slate-400 transition hover:bg-slate-100 hover:stroke-white hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <Icon iconName="x-close" className="stroke-slate-500" />
                    ) : (
                      <Icon iconName="menu-03" className="stroke-slate-500" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-end sm:items-stretch lg:justify-start">
                  <Link href="/" className="flex flex-shrink-0 items-center">
                    {/* //+ Mobile Logo */}
                    <img
                      src="/img/dghs.png"
                      alt={dghsLogoTitleAndAria}
                      aria-label={dghsLogoTitleAndAria}
                      title={dghsLogoTitleAndAria}
                      className="ml-28 mr-12 block w-40 md:ml-0 md:hidden"
                    />
                    {/* //+ Desktop Logo */}
                    <div className="flex items-center gap-x-16">
                      <img
                        className="hidden w-44 md:block"
                        src="/img/dghs.png"
                        alt={dghsLogoTitleAndAria}
                        aria-label={dghsLogoTitleAndAria}
                        title={dghsLogoTitleAndAria}
                      />
                      <div className="info">
                        <span className="mt-2 block text-sm font-semibold leading-4 tracking-tight md:mt-0 md:text-base">
                          Directorate General of Health Services
                        </span>
                        <span className="block text-xs text-slate-500 md:mt-0">
                          People&apos;s Republic of Bangladesh.
                        </span>
                      </div>
                    </div>
                  </Link>
                  {/* //+ Menu Links */}

                  <div className="hidden items-center space-x-4 md:ml-auto md:flex lg:space-x-4">


                    {navigation.links.map((item, index) => (
                      session ? (
                        <Link
                          key={index}
                          href={item.href}
                          className={`nav-links relative top-2 inline-flex items-center rounded-md border-b-2 border-transparent px-8 py-4 font-medium text-slate-700 hover:bg-slate-100 hover:text-primary
                         ${pathname == item.href && "!text-primary"}
                        `}
                        >
                          {item.name}
                        </Link>) : <></>
                    ))}
                    {/* //+ Profile dropdown Avatar */}
                    {session && (
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button className="ml-8 flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                            <span className="sr-only">Open user menu</span>
                            <Avatar size="xs" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-50"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          {/* //- Dropdown Links */}
                          <Menu.Items className="absolute right-0 z-10 mt-8 w-164 origin-top-right rounded-md bg-white py-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userDropdown.links.map((item, index) => (
                              <Menu.Item key={index}>
                                {({ active }) => (
                                  <Link
                                    onClick={() => {
                                      signOutOfApp(item.href);
                                    }}
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-slate-100" : "",
                                      "block px-16 py-8 font-medium text-slate-700 sm:text-sm lg:text-base"
                                    )}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}

                    <Link
                      href="/"
                      className="flex flex-shrink-0 items-center"
                    >
                      {/* //+ Mobile Logo */}
                      <img
                        src="/img/mis_logo.png"
                        alt={misDGHSLogoTitle}
                        aria-label={misDGHSLogoTitle}
                        title={misDGHSLogoTitle}
                        className="ml-28 mr-12 block w-40 md:ml-0 md:hidden"
                      />
                      {/* //+ Desktop Logo */}
                      <div className="flex items-center pl-12">
                        <img
                          src="/img/mis_logo.png"
                          alt={misDGHSLogoTitle}
                          aria-label={misDGHSLogoTitle}
                          title={misDGHSLogoTitle}
                          className="hidden w-44 md:block"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* //+ Mobile Menu Expanded */}
            <Disclosure.Panel className="md:hidden">
              <div className="space-y- bg-white py-20">
                {/* //! Manually placed Links for mobile view */}
                <div className="md:hidden">
                  {companies.map((item, index) => (
                    <Disclosure.Button
                      key={index}
                      as="a"
                      href={item.href}
                      className="block border-l-4 border-transparent py-8 pl-12 pr-16 text-base font-medium text-slate-500 hover:border-primary-300 hover:bg-slate-50 hover:text-slate-700"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                {session ? (
                  navigation.links.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block border-l-4 border-transparent py-8 pl-12 pr-16 text-base font-medium text-slate-500 hover:border-primary-300 hover:bg-slate-50 hover:text-slate-700"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* //+ MODAL Search */}
      {showSearchModal && (
        <ModalBlank
          modalSize="sm"
          onCloseModal={(e: any) => handleClose()}
          className="!py-40"
        >
          <header className="space-y-16">
            <div className="flex items-center gap-x-8">
              <Icon
                iconName="search-lg"
                iconSize="24"
                iconColor={variables.primary500}
              />
              <h5>Search</h5>
            </div>

            <div className="flex items-center gap-x-8">
              <p className="text-base text-slate-700">
                Select Location: {currentLocation}
              </p>
              <button
                onClick={() => {
                  setShowLocationModal(true);
                  setShowSearchModal(false);
                }}
              >
                <small className="text-primary transition hover:text-primary-600">
                  Change
                </small>
              </button>
            </div>
          </header>
          <div className="space-y-20">
            <TextField label="" placeholder="e.g. Dhaka" />
          </div>
          <Button
            fullWidth={true}
            btnText="Search"
            iconName="search-lg"
            iconPos="left"
            clicked={handleSearchRoute}
          />
        </ModalBlank>
      )}

      {/* //+ MODAL Change Location */}
      {showLocationModal && (
        <ModalBlank
          modalSize="sm"
          onCloseModal={(e: any) => handleClose()}
          className="!py-40"
        >
          <header>
            <div className="flex items-center gap-x-8">
              <Icon
                iconName="marker-pin-04"
                iconSize="24"
                iconColor={variables.primary500}
              />
              <h5>Set your location</h5>
            </div>
          </header>
          <div className="space-y-20">
            <TextField label="" placeholder="e.g. Dhaka" />
          </div>
          <Button
            fullWidth={true}
            btnText="Set Location"
            iconName="check"
            iconPos="right"
            clicked={handleSwitchModals}
          />
        </ModalBlank>
      )}
    </>
  );
});
export default Navbar;
