import React,{ useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { useUserContext } from "../context/user";


const login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginStarted, setIsLoginStarted] = useState(false)
  const [loginError, setLoginError] = useState('')
  const router = useRouter();
  const { saveName, saveEmail, saveToken, saveIsAdmin } = useUserContext();


  const handleLogin = () => {
    setIsLoginStarted(true)
    console.log("aditya");
    var data = JSON.stringify({
      "email": email,
      "password": password
    });

    var config = {
      method: 'post',
      url: 'http://127.0.0.1:8000/auth/token',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
      .then(function (response) {
        console.log("login sucessfully");
        saveName(response.data.name);
        saveEmail(email);
        saveToken(response.data.access_token);
        saveIsAdmin(response.data.isAdmin);
        router.push("/");
      console.log(JSON.stringify(response.data));
    })
      .catch(function (error) {
        alert("enter valid credentials")
        setIsLoginStarted(false)
      console.log(error);
    });
    
  }

  return (

    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form >
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: "#ff6219" }}
                        ></i>
                        <span className="h1 fw-bold mb-0">Saya</span>
                      </div>
                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Sign into your account
                      </h5>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        
                        />
                        <label className="form-label" htmlFor="form2Example17">
                          Email address
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={e=> setPassword(e.target.value)}
                        />
                        <label className="form-label" htmlFor="form2Example27">
                          Password
                        </label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="button"
                          disabled={isLoginStarted}
                          onClick={handleLogin}
                        >
                          Login
                        </button>
                      </div>

                      <a className="small text-muted" href="#!">
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        {" "}
                        Dont have an account?{" "}
                        <Link href="/register" style={{ color: "#393f81" }}>
                          Register here
                        </Link>
                      </p>
                      <Link href="#!" className="small text-muted">
                        Terms of use.
                      </Link>
                      <Link href="#!" className="small text-muted">
                        Privacy policy
                      </Link>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default login;
