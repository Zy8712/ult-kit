'use client'
import { useSelector } from 'react-redux';
import Footer from '@/components/shared-components/Footer';

export default function PageShiftNavLayout(props){

    const { expandedMenu } = useSelector(state => state.generalUI);

    return(
        <>
            <div className={`min-h-screen ${expandedMenu ? 'pl-60' :'pl-14'} py-24 transition-all duration-500 ease-in-out`}>
                {props.children}
            </div>
            <Footer />
        </>
    );
}