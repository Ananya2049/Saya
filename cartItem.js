/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useUserContext } from "../../context/user";
import axios from 'axios';

const CartItem = props => {
    const { brand, name, price, quantity, image } = props.item;
    const [q, setq] = React.useState(quantity);
    const { token } = useUserContext();

    const deleteCart = () => {
        var data = JSON.stringify({
            "name": name,
            "quantity": 0
        });
        var config = {
            method: 'post',
            url: 'http://127.0.0.1:8000/deletecart',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        };
          
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                props.setTemp(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    const updateQuantity = (e) => {
        setq(e.target.value);
        var data = JSON.stringify({
            "name": name,
            "quantity": e.target.value || 0
          });
          var config = {
            method: 'post',
            url: 'http://127.0.0.1:8000/updatecart',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
              console.log(JSON.stringify(response.data));
              props.setTemp(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
          
    }
    return (
      <>
<div className="row mb-4 d-flex justify-content-between align-items-center">
                      <div className="col-md-2 col-lg-2 col-xl-2">
                        <img
                          src={image}
                          className="img-fluid rounded-3" alt="Cotton T-shirt"/>
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-3">
                        <h6 className="text-muted">{brand}</h6>
              <h6 className="text-black mb-0">{ name}</h6>
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                        <button className="btn btn-link px-2"
                          onClick="this.parentNode.querySelector('input[type=number]').stepDown()">
                          <i className="fas fa-minus"></i>
                        </button>
  
                    <input id="form1" min="0" name="quantity" value={q} type="number" onChange={updateQuantity}
                          className="form-control form-control-sm" />
  
                        <button className="btn btn-link px-2"
                  onClick={() => {
                    setq(q + 1);
                          }}>
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
              <h6 className="mb-0">₹ {price*q }</h6>
                      </div>
                      <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                        <button href="#!" className="text-muted" onClick={deleteCart}>delete</button>
                      </div>
      </div>
                          <hr className="my-4"/>
</>
  )
}

export default CartItem;