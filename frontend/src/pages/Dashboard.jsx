import React from 'react'
import Navbar from '../Components/Navbar/Navbar/Navbar'
import Hero from '../Components/Navbar/Navbar/Hero/Hero'
import Companies from '../Components/Navbar/Navbar/Companies/Companies'
import CardSection from '../Components/Navbar/Navbar/CardSection/CardSection'
import PocketedStats from '../Components/Navbar/Navbar/PocketedStats/PocketedStats'
import HowPocketedWorks from '../Components/Navbar/Navbar/HowPocketedWorks/HowPocketedWorks'
import Footer from '../Components/Navbar/Navbar/Footer/Footer'
import { motion } from 'framer-motion';


const Dashboard = () => {
    return (
        <div className=''>

            <Hero />
            <Companies />
            <CardSection />
            <PocketedStats />
            <HowPocketedWorks />

        </div>
    )
}

export default Dashboard
