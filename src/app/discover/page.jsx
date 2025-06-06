import PageShiftNavLayout from "@/layouts/PageShiftNavLayout";

export default function Discover() {
    return (
        <>
            <PageShiftNavLayout>
                <div className="flex flex-col justify-center items-center">
                    <img
                        src="/undraw_building-websites_k2zp.svg"
                        alt=""
                        className="max-w-[600px] w-full"
                    />
                    <span className="mt-8 text-2xl text-white text-bold font-theme-orbitron uppercase">Page Under Maintenance.</span>
                </div>
            </PageShiftNavLayout>

        </>
    );
}
