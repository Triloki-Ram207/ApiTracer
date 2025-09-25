import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import '../cssFiles/home.css'

function Home() {
  return (
    <main className='home'>
      <Sidebar />
      <section className='content'>
  <React.Suspense fallback={<p>Loading...</p>}>
    <Outlet />
  </React.Suspense>
</section>
    </main>
  );
}


export default Home
