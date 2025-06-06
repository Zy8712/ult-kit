import PageShiftNavLayout from "@/layouts/PageShiftNavLayout";
import ToolCategoryPageHeader from "@/layouts/ToolCategoryPageHeader";
import UltimateToolCard from "@/components/tool-card-components/UltimateToolCard";
import all_data from "@/data/all-sites.json";

export default function Featured() {
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
