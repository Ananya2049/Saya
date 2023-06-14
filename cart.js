import React, { useEffect,useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/navbar';
import { useUserContext } from "../context/user";
import { useRouter } from 'next/router'
import CartItem from './components/cartItem';
import Link from 'next/link';
const Cart = props => {
  const { token } = useUserContext();
  const [cartItems, setCartItems] = useState([]);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const router = useRouter();
  const [temp, setTemp] = useState(0);
  const [page, setPage] = useState("cart");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    console.log("cart page",token);
    if (token!="") {
      var config = {
        method: 'get',
        url: 'http://127.0.0.1:8000/cart',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      axios(config)
        .then(function (response) {
          setCartItems(response.data.list);
          setTotalCartItems(response.data.length);
          setTotalCartPrice(response.data.totalPrice);
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      
      config = {
          method: 'get',
          url: 'http://127.0.0.1:8000/address',
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        };
        
        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          setFname(response.data.address.fname);
          setLname(response.data.address.lname);
          setEmail(response.data.address.email);
          setAddress(response.data.address.address);
          setCity(response.data.address.city);
          setZip(response.data.address.zip);
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }
    else {
      router.push("/login");
    }
  }, [temp]);
  const placeOrder = e => {
    e.preventDefault();
    var data = JSON.stringify({
      "fname": fname,
      "lname": lname,
      "city": city,
      "zip": zip,
      "address": address,
      "email": email
    });
    
    var config = {
      method: 'post',
      url: 'http://127.0.0.1:8000/address',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      router.push("/");
    })
    .catch(function (error) {
      console.log(error);
    });
    var config = {
      method: 'get',
      url: 'http://127.0.0.1:8000/placeorder',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
    
    alert("Order Placed Successfully");
    
  }

  return (
    <>
      <Navbar />
    <section className="h-100 h-custom" style={{backgroundColor:"#d2c9ff"}}>
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12">
              {page=="cart"?( <div className="card card-registration card-registration-2" style={{borderRadius:"15px"}}>
            <div className="card-body p-0">
              <div className="row g-0">
                <div className="col-lg-8">
                  <div className="p-5">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                      <h1 className="fw-bold mb-0 text-black">Shopping Cart</h1>
                      <h6 className="mb-0 text-muted">{totalCartItems} items</h6>
                    </div>
                        <hr className="my-4" />
                        {
                          cartItems.map((item, index) => {
                            console.log(item, index);
                            return <CartItem key={index} item={item} cartItems={cartItems} setTemp={setTemp}/>
                          }
                          )
                        }
                    <div className="pt-5">
                      <h6 className="mb-0"><button onClick={()=>{router.push("/")}} className="text-body"><i
                            className="fas fa-long-arrow-alt-left me-2"></i>Back to shop</button></h6>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 bg-grey">
                  <div className="p-5">
                    <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                    <hr className="my-4"/>
  
                    <div className="d-flex justify-content-between mb-4">
                          <h5 className="text-uppercase">items { totalCartItems}</h5>
                          <h5>₹ { totalCartPrice}</h5>
                    </div>
  
                    <h5 className="text-uppercase mb-3">Shipping</h5>
  
                    <div className="mb-4 pb-2">
                      <select className="select">
                        <option value="1">Standard-Delivery- ₹40.00</option>
                      </select>
                    </div>
  
                    <hr className="my-4"/>
  
                    <div className="d-flex justify-content-between mb-5">
                      <h5 className="text-uppercase">Total price</h5>
                          <h5>₹ { totalCartPrice+40}</h5>
                    </div>
  
                    <button type="button" className="btn btn-dark btn-block btn-lg"
                          data-mdb-ripple-color="dark" onClick={() => {
                            setPage("address"); 
                      }}>Buy Now</button>
                  </div>
                </div>
              </div>
            </div>
              </div>) : (
                  <div className="gradient-custom">
                  <div className="row mt-3 mx-3" style={{ marginTop: 25 }}>
                  <div className="col-md-3">
                    <div style={{ marginTop: 50, marginLeft: 10 }} className="text-center">
                      <i
                        id="animationDemo"
                        data-mdb-animation="slide-right"
                        data-mdb-toggle="animation"
                        data-mdb-animation-reset="true"
                        data-mdb-animation-start="onScroll"
                        data-mdb-animation-on-scroll="repeat"
                        className="fas fa-3x fa-shipping-fast text-white"
                      />
                      <h3 className="mt-3 text-white">Welcome</h3>
                      <p className="white-text">
                        You are 30 seconds away from compleating your order!
                      </p>
                    </div>
                    <div className="text-center">
                          <button type="submit" className="btn btn-white btn-rounded back-button" onClick={() => {
                            setPage("cart");
                      }}>
                        Go back
                      </button>
                    </div>
                  </div>
                  <div className="col-md-9 justify-content-center">
                    <div className="card card-custom pb-4">
                      <div className="card-body mt-0 mx-5">
                        <div className="text-center mb-3 pb-2 mt-3">
                          <h4 style={{ color: "#495057" }}>Delivery Details</h4>
                        </div>
                        <form className="mb-0">
                          <div className="row mb-4">
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="text"
                                  id="form9Example1"
                                      className="form-control input-custom"
                                      value={fname}
                                      onChange={e => setFname(e.target.value)}
                                      placeholder="First Name"
                                />
                                <label className="form-label" htmlFor="form9Example1">
                                  First name
                                </label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="text"
                                  id="form9Example2"
                                      className="form-control input-custom"
                                      value={lname}
                                      onChange={e => setLname(e.target.value)}
                                />
                                <label className="form-label" htmlFor="form9Example2">
                                  Last name
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="text"
                                  id="form9Example3"
                                      className="form-control input-custom"
                                      value={city}
                                      onChange={e => setCity(e.target.value)}
                                />
                                <label className="form-label" htmlFor="form9Example3">
                                  City
                                </label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="text"
                                  id="form9Example4"
                                      className="form-control input-custom"
                                      value={zip}
                                      onChange={e => setZip(e.target.value)}
                                />
                                <label className="form-label" htmlFor="form9Example4">
                                  Zip
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="text"
                                  id="form9Example6"
                                      className="form-control input-custom"
                                      value={address}
                                      onChange={e => setAddress(e.target.value)}
                                />
                                <label className="form-label" htmlFor="form9Example6">
                                  Address
                                </label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="email"
                                  id="typeEmail"
                                      className="form-control input-custom"
                                      value={email}
                                      onChange={e => setEmail(e.target.value)}
                                />
                                <label className="form-label" htmlFor="typeEmail">
                                  Email
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="float-end ">
                            <button
                                  className="btn btn-primary btn-rounded"
                                  style={{ backgroundColor: "#0062CC" }}
                                  onClick={placeOrder}
                            >
                              Place order
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                    </div>
                    </div>    
              )}
         
              
        </div>
      </div>
    </div>
      </section>
      </>
  )
}

export default Cart