import React from 'react'
import { Link } from 'react-router-dom'
import './css/Home.css'

export default function Home() {

  return (
    <>

      <Link to="/"></Link>
      <div className="container-fluid text-center" style={{ backgroundColor: 'white', width: '40%', marginTop: '200px', padding: '20px 40px', borderRadius: '20px', border: '3px solid black' }}>
        <h1><b>Cloudbook</b></h1>
        <h2><i><b>'Your thoughts - securely in the cloud'</b></i></h2>

        <div>
          <Link to="/login"><button className="loginbutton my-5 mx-5"><i className="fa-solid fa-right-to-bracket"></i><b> Login</b></button></Link>
          <Link to="/createaccount"><button className="signupbutton mx-5"><i className="fa-solid fa-user-plus"></i><b> Create Account</b></button></Link>
        </div>
      </div>
    </>
  )
}