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
client = pymongo.MongoClient('mongodb+srv://saloni:saloni@cluster0.9jaw6.mongodb.net/saloni?retryWrites=true&w=majority')
db = client.saloni
USERS=db.users
PRODUCTS=db.products
CART=db.cart
ORDER=db.order


class Settings(BaseSettings):
    secret: str  # automatically taken from environment variable

class UserCreate(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class User(BaseModel):
    id: UUID4

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None
    discount: int
    rating: int
    brand: Optional[str] = None
    quantity: int


class Product(BaseModel):
    id: UUID4



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
        return {"detail": "Successfull registered"}


@app.post(TOKEN_URL)
def login(data: UserCreate):
    email = data.email
    password = data.password
    user = get_user(email)  # we are using the same function to retrieve the user
    if not user:
        raise InvalidCredentialsException  # you can also use your own HTTPException
    elif password != user["password"]:
        raise InvalidCredentialsException
    access_token = manager.create_access_token(
        data=dict(sub=email)
    )
    return {'access_token': access_token, 'token_type': 'bearer'}


@app.get("/private")
def private_route(user=Depends(manager)):
    return {"detail": f"Welcome {user.email}"}


@app.post("/device/")
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

@app.post("/cart/")
async def add_cart(item: Item, user=Depends(manager)):
    print(user)
    if user["role"] != "admin":
        cart=CART.find_one({"email":user["email"]})
        if cart:
            print(cart)
            list_of_bool = [True for elem in cart["devices"]
                            if item.name in elem.values()]
            if any(list_of_bool):
                cart["devices"][:] = [d for d in cart["devices"] if d.get('name') != item.name]
            cart["devices"].append(item.dict())
            CART.update_one({"email":user["email"]},{ "$set": cart})
        else:
            CART.insert_one({"email":user["email"],"devices":[item.dict()]})
    else:
        raise HTTPException(status_code=400, detail="You are not allowed to add to cart")
    return {"detail": "Device added successfully to cart"}

@app.get("/cart/")
async def get_cart(user=Depends(manager)):
    cart= CART.find_one({"email":user["email"]})
    if cart:
        return {"length":len(cart["devices"]),"list":cart["devices"]}
    else:
        return {"length":0, "list":[]}

@app.get('/devices/')
async def get_items():
    devices=list(PRODUCTS.find({},{'_id': 0}))
    return {"length": len(devices), "list": devices}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app",reload=True)