import React,{useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Product from './product';
import axios from 'axios'

const ProductList = () => {
    
    const [products, setProducts] = React.useState([]);
    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://127.0.0.1:8000/devices'};
          
          axios(config)
              .then(function (response) {
              setProducts(response.data.list);
          })
          .catch(function (error) {
            console.log(error);
          });
    }, []);
      
  return (
    <div>
        <section style={{backgroundColor:"#eee"}}>
  <div className="container py-5">
    <div className="row">
        {products.map((device,index)=>{
            return <Product device={device} key={index}/>
        })}
      
    </div>
  </div>
</section>
    </div>
  )
}

export default ProductList