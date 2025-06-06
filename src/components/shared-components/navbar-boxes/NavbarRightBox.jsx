// Assuming NavbarRightBox.jsx is in src/utils/navbarComponents.jsx or similar
// This component will now effectively be a client component due to AuthStatusLinks
'use client'; // Add this if not already present, or if its direct children require client context

// Remove: import { Login } from "@/utils/navbarComponents";
import AuthStatusLinks from '../navbar-components/AuthStatusLinks'; // Import the new component

import SettingsButton from "../navbar-components/SettingsButton"; // Assuming these are client components or fine as is
import QuickAccessButton from "../navbar-components/QuickAccessButton";
import AccessCodeButton from "../navbar-components/AccessCodeButton";
import FocusModeButton from "../navbar-components/FocusModeButton";

export default function NavbarRightBox() {
    return (
        <>
            <div className="w-full max-w-md h-full flex justify-end items-center gap-x-1 sm:gap-x-2"> {/* Adjusted max-width and gap */}
                <FocusModeButton />
                <AccessCodeButton />
                <QuickAccessButton />
                <SettingsButton />
                <AuthStatusLinks /> {/* Use the new component here */}
            </div>
        </>
    );
}