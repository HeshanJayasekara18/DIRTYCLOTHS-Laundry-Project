import Navbar from '../common/navbar/Navbar';
import { Outlet } from "react-router-dom";
import Section1 from './section1/Section1';
import Section2 from './section2/Section2';
import Section3 from './section3/Section3';
import Section4 from './section4/Section4';
import Section5 from './section5/Section5';
import Footer from './footer/Footer';
 import TransparentWaterEffect from './TransparentWaterEffect';

function Home() {
    return (
        <div>
            <Navbar />
            <TransparentWaterEffect />
            <Section1 />
            <Section2 />
            <Section3 />
            <Section4 />
            <Section5 />
            <Footer />
            
            <Outlet />
        </div>
    )
}

export default Home;