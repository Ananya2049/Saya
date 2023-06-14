import uuid

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseSettings, BaseModel, UUID4
from fastapi.middleware.cors import CORSMiddleware
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from starlette.responses import RedirectResponse

import pymongo
client = pymongo.MongoClient('mongodb+srv://ananya:ananya@cluster0.ygsjc3p.mongodb.net/?retryWrites=true&w=majority')
db = client.ananya
USERS=db.users
PRODUCTS=db.products
CART=db.cart
ORDER=db.order
ADDRESS=db.address


class Settings(BaseSettings):
    secret: str  # automatically taken from environment variable

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str]= None
    role: Optional[str] = None
    name: Optional[str] = None

class User(BaseModel):
    id: UUID4

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    discount: int
    star: int
    brand: Optional[str] = None
    quantity: int
    image: str

class Cart(BaseModel):
    name: str
    quantity: Optional[int]= 1

class Product(BaseModel):
    id: UUID4

class Address(BaseModel):
    fname: str
    lname: str
    city: str
    zip: str
    address: Optional[str] = None
    email: str


DEFAULT_SETTINGS = Settings(_env_file=".env")
DB = {
    "users": {}
}
TOKEN_URL = "/auth/token"

app = FastAPI()
# Allows cors for everyone **Ignore**
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
manager = LoginManager(DEFAULT_SETTINGS.secret, TOKEN_URL)


@manager.user_loader
def get_user(email: str):
    return USERS.find_one({"email": email})


@app.get("/")
def main():
    return RedirectResponse(url="/docs")


@app.post("/auth/register")
def register(user: UserCreate):
    print(user)

    if USERS.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="A user with this email already exists")
    else:
        USERS.insert_one(user.dict())
        access_token = manager.create_access_token(
            data=dict(sub=user.email)
        )
        return {"detail": "Successfull registered",'access_token': access_token, 'token_type': 'bearer'}




@app.post(TOKEN_URL)
def login(data: UserCreate):
    email = data.email
    password = data.password
    user = get_user(email)  # we are using the same function to retrieve the user
    print(user)
    print(password)
    if not user:
        raise InvalidCredentialsException  # you can also use your own HTTPException
    elif password != user["password"]:
        raise InvalidCredentialsException
    access_token = manager.create_access_token(
        data=dict(sub=email)
    )
    return {'access_token': access_token, 'token_type': 'bearer',"isAdmin":user['role']!="user",'name':user['name']}


@app.get("/private")
def private_route(user=Depends(manager)):
    return {"detail": f"Welcome {user.email}"}


@app.post("/adddevice/")
async def create_item(item: Item, user=Depends(manager)):
    print(user)
    if user["role"] == "admin":
        if PRODUCTS.find_one({"name":item.name}):
            raise HTTPException(status_code=400, detail="Same name device is already exists")
        else:
            PRODUCTS.insert_one(item.dict())
    else:
        raise HTTPException(status_code=400, detail="You are not allowed to create a new product")
    return {"detail": "Device added successfully"}

@app.post("/addcart/")
async def add_cart(item: Cart, user=Depends(manager)):
    print(user)
    if user["role"] != "admin":
        cart=CART.find_one({"email":user["email"]})
        if cart:
            print(cart)
            if item.name in cart["devices"]:
                cart["devices"][item.name]["quantity"]=item.quantity+cart["devices"][item.name]["quantity"]
            else:
                cart["devices"][item.name]={}
                cart["devices"][item.name]["quantity"]=item.quantity
            # list_of_bool = [True for elem in cart["devices"]
            #                 if item.name in elem.values()]
            # if any(list_of_bool):
            #     cart["devices"][:] = [d for d in cart["devices"] if d.get('name') != item.name]
            # cart["devices"].append(item.dict())
            CART.update_one({"email":user["email"]},{ "$set": cart})
        else:
            CART.insert_one({"email":user["email"],"devices":{item.name:{"quantity":item.quantity}}})
    else:
        raise HTTPException(status_code=400, detail="You are not allowed to add to cart")
    return {"detail": "Device added successfully to cart"}

@app.post("/updatecart/")
async def update_cart(item: Cart, user=Depends(manager)):
    print(user)
    if user["role"] != "admin":
        cart=CART.find_one({"email":user["email"]})
        if cart:
            print(cart)
            if item.name in cart["devices"]:
                cart["devices"][item.name]["quantity"]=item.quantity
            else:
                cart["devices"][item.name]={}
                cart["devices"][item.name]["quantity"]=item.quantity
            # list_of_bool = [True for elem in cart["devices"]
            #                 if item.name in elem.values()]
            # if any(list_of_bool):
            #     cart["devices"][:] = [d for d in cart["devices"] if d.get('name') != item.name]
            # cart["devices"].append(item.dict())
            CART.update_one({"email":user["email"]},{ "$set": cart})
        else:
            CART.insert_one({"email":user["email"],"devices":{item.name:{"quantity":item.quantity}}})
    else:
        raise HTTPException(status_code=400, detail="You are not allowed to add to cart")
    return {"detail": "Device added successfully to cart"}


@app.post("/deletecart/")
async def delete_cart(item: Cart, user=Depends(manager)):
    print(user)
    if user["role"] != "admin":
        cart=CART.find_one({"email":user["email"]})
        if cart:
            print(cart)
            if item.name in cart["devices"]:
                del cart["devices"][item.name]

            CART.update_one({"email":user["email"]},{ "$set": cart})

    else:
        raise HTTPException(status_code=400, detail="You are not allowed to add to cart")
    return {"detail": "Device added successfully to cart"}


@app.get("/cart/")
async def get_cart(user=Depends(manager)):
    cart= CART.find_one({"email":user["email"]})
    if cart:
        itemList=[]
        inValid=[]
        totalPrice=0
        for device in cart["devices"]:
            print(device)
            details=PRODUCTS.find_one({"name": device},{'_id': 0})
            if details:
                temp={}
                temp["name"]=details["name"]
                temp["description"]=details["description"]
                temp["price"]=details["price"]
                temp["quantity"]=cart["devices"][device]["quantity"]
                temp["star"]=details["star"]
                temp["brand"]=details["brand"]
                temp["image"]=details["image"]
                totalPrice+=int(details["price"]) * int(cart["devices"][device]["quantity"])
                itemList.append(temp)
            else:
                inValid.append(device)
        for device in inValid:
            del cart["devices"][device]
        return {"length":len(cart["devices"]),"totalPrice":totalPrice,"list":itemList}
    else:
        return {"length":0, "list":[]}


@app.post("/address/")
async def add_cart(address: Address, user=Depends(manager)):
    print(user)
    if user["role"] != "admin":
        add=ADDRESS.find_one({"email":user["email"]})
        if add:
            print(add)
            add["address"]={
                "fname": address.fname,
                "lname": address.lname,
                "city": address.city,
                "address": address.address,
                "email": address.email,
                "zip": address.zip
            }
            ADDRESS.update_one({"email":user["email"]},{ "$set": add})
        else:
            ADDRESS.insert_one({"email":user["email"],"address":{
                "fname": address.fname,
                "lname": address.lname,
                "city": address.city,
                "address": address.address,
                "email": address.email,
                "zip": address.zip
            }})
    else:
        raise HTTPException(status_code=400, detail="You are not allowed to add to cart")
    return {"detail": "Address saved successfully"}

@app.get("/address/")
async def get_cart(user=Depends(manager)):
    address= ADDRESS.find_one({"email":user["email"]},{'_id': 0})
    if address:
        return {"address":address["address"]}
    else:
        return {"length":0,"address":{}}


@app.get("/placeorder/")
async def placeorder(user=Depends(manager)):
    print(user)
    if user["role"] != "admin":
        CART.delete_one({"email": user["email"]})
    else:
        raise HTTPException(status_code=400, detail="You are not allowed to add to cart")
    return {"detail": "Device added successfully to cart"}


@app.get('/devices/')
async def get_items():
    devices=list(PRODUCTS.find({},{'_id': 0}))
    return {"length": len(devices), "list": devices}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app",reload=True)