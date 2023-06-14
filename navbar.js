/* eslint-disable @next/next/no-img-element */
import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useUserContext } from "../../context/user";
import Link from 'next/link'
import { useRouter } from 'next/router'

const Navbar = () => {
  const { name, isAdmin, token, saveToken, saveName, saveEmail, saveIsAdmin } = useUserContext();
  const router = useRouter()

  const logout = () => {
    saveName("");
    saveToken("");
    saveIsAdmin(false);
    saveEmail("");
  }

  return (
    <>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/* Container wrapper */}
      <div className="container">
        {/* Navbar brand */}
        <Link className="navbar-brand me-2" href="/">
          <img
            src="/logo.png"
            height={30}
            alt="saya Logo"
            loading="lazy"
            style={{ marginTop: "-1px" }}
          />
        </Link>
        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#navbarButtonsExample"
          aria-controls="navbarButtonsExample"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars" />
        </button>
        {/* Collapsible wrapper */}
        <div className="collapse navbar-collapse" id="navbarButtonsExample">
          {/* Left links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" href="/cart">
                cart
              </Link>
              </li>
              {isAdmin?(<li className="nav-item">
              <Link className="nav-link" href="/add">
                Add Product
              </Link>
            </li>):null}
              
          </ul>
            {token === "" ? (
              <div className="d-flex align-items-center">
              <Link type="button" href="/login" className="btn btn-link px-3 me-2 pr-3">
                Login
              </Link>
              <Link type="button" href="/register" className="btn btn-primary me-3">
                Sign up for free
              </Link>
            </div>
            ) : (
              <div className="d-flex align-items-center">
                  {name}
                  <button type="button" className="btn btn-primary me-3" onClick={logout}>
            Logout
          </button>
            </div>
          )}     
          
        </div>
        {/* Collapsible wrapper */}
      </div>
      {/* Container wrapper */}
    </nav>
    {/* Navbar */}
  </>
  
  )
}

export default Navbar