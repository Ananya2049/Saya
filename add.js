import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/navbar';
import { useUserContext } from "../context/user";
import { useRouter } from 'next/router'

const Add = props => {
  const { token, isAdmin } = useUserContext();
  const router = useRouter();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [star, setStar] = useState("");
    const [image, setImage] = useState("");
    const [quantity, setQuantity] = useState("");
    const [brand, setBrand] = useState("");

  useEffect(() => {
    if (token === "" || isAdmin === false) {
      router.push("/login");
    }
  }, [token, isAdmin]);
  const addProduct = e => {
    e.preventDefault();
    if (token != "" && isAdmin) {
      var data = JSON.stringify({
        "name": name,
        "price": price,
        "discount": discount,
        "star": star,
        "brand": brand,
        "image": image,
        "quantity": quantity
      });
          
      var config = {
        method: 'post',
        url: 'http://127.0.0.1:8000/adddevice',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: data
      };
          
      axios(config)
        .then(function (response) {
          alert("product added successfully");
          router.push("/");

        })
        .catch(function (error) {
          alert(error.response.data.detail);
        });
    }
    else {
      alert("please login as admin");
      router.push("/login");
    }
    }



  return (
    <>
      <Navbar />
    <section className="h-100 h-custom" style={{backgroundColor:"#d2c9ff"}}>
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12">
            <div className="gradient-custom">
                  <div className="row mt-3 mx-3" style={{ marginTop: 25 }}>
                  <div className="col-md-3">
                    <div style={{ marginTop: 50, marginLeft: 10 }} className="text-center">
                      <i
                        data-mdb-animation="slide-right"
                        data-mdb-toggle="animation"
                        data-mdb-animation-reset="true"
                        data-mdb-animation-start="onScroll"
                        data-mdb-animation-on-scroll="repeat"
                        className="fas fa-3x fa-shipping-fast text-white"
                      />
                      <h3 className="mt-3 text-white">Welcome</h3>
                      <p className="white-text">
                        Add Product!
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
                                      className="form-control input-custom"
                                      value={name}
                                      onChange={e => setName(e.target.value)}
                                      placeholder="Enter product name"
                                />
                                <label className="form-label" htmlFor="form9Example1">
                                  Name
                                </label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="text"
                                      className="form-control input-custom"
                                      value={brand}
                                  onChange={e => setBrand(e.target.value)}
                                  placeholder="Enter brand"
                                />
                                <label className="form-label" htmlFor="form9Example2">
                                  Brand
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="number"
                                      className="form-control input-custom"
                                      value={price}
                                  onChange={e => setPrice(e.target.value)}
                                  placeholder="Enter price"
                                />
                                <label className="form-label" htmlFor="form9Example3">
                                  Price
                                </label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="number"
                                      className="form-control input-custom"
                                      value={discount}
                                  onChange={e => setDiscount(e.target.value)}
                                  placeholder="Enter discount"
                                />
                                <label className="form-label" htmlFor="form9Example4">
                                  Discount
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="number"
                                      className="form-control input-custom"
                                      value={star}
                                  onChange={e => setStar(e.target.value)}
                                  placeholder="Enter stars (1-5)"
                                  min={1}
                                  max={5}
                                />
                                <label className="form-label" htmlFor="form9Example6">
                                  Star
                                </label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-outline">
                                <input
                                  type="number"
                                      className="form-control input-custom"
                                      value={quantity}
                                  onChange={e => setQuantity(e.target.value)}
                                  placeholder="Enter quantity"
                                />
                                <label className="form-label" htmlFor="typeEmail">
                                  Quantity
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
                                      value={image}
                                  onChange={e => setImage(e.target.value)}
                                  placeholder="Enter image link"
                                />
                                <label className="form-label" htmlFor="form9Example6">
                                  Image
                                </label>
                              </div>
                            </div>
                            
                          </div>
                          <div className="float-end ">
                            <button
                                  className="btn btn-primary btn-rounded"
                                  style={{ backgroundColor: "#0062CC" }}
                                  onClick={addProduct}
                            >
                             Add Product
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                    </div>
                    </div>    
         
              
        </div>
      </div>
    </div>
      </section>
      </>
  )
}

export default Add