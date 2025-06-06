// Navbar.jsx
// Consider adding 'use client'; if needed for context propagation to children or for its own interactivity.
// If NavbarLeftBox and NavbarCenterBox are pure UI and don't use hooks, this might remain a Server Component.
// However, if popups are interactive client components using React context, Navbar might need to be client-side.
// For simplicity, assuming your existing structure works or that NavbarRightBox handles its client nature.

import { AccessCodePopup, FocusModePopup, NavbarCenterBox, NavbarLeftBox, NavbarRightBox, QuickAccessPopup, SettingsPopup } from "@/utils/navbarComponents";

export default function Navbar() {
    return (
        <>
            <nav className="fixed top-0 z-50 w-full h-16 bg-black bg-opacity-50 backdrop-blur-sm px-2">
                <div className="w-full h-full flex justify-between items-center"> {/* Added max-width and mx-auto for content */}
                    <NavbarLeftBox />
                    <NavbarCenterBox />
                    <NavbarRightBox /> {/* This now renders the dynamic AuthStatusLinks */}
                </div>

                {/* These popups might also need to be client components if interactive */}
                <SettingsPopup />
                <QuickAccessPopup />
                <AccessCodePopup />
                <FocusModePopup />
            </nav>
        </>
    );
}