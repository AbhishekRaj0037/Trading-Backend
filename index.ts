import express from "express";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser({}));

interface Balances {
    [key: string]: number;
}

interface User {
    id: string;
    balances: Balances;
};

interface order {
    userId: String;
    price: Number;
    quantity: Number;
}

const users: User[] = [{
    id: "1",
    balances: {
        "GOOGLE": 10,
        "USD": 50000
    }
}, {
    id: "2",
    balances: {
        "GOOGLE": 10,
        "USD": 50000
    }
}];

export const Ticker = "GOOGLE";

app.post('/order', (req: any, res: any) => {
    const side: string = req.body.side;
    const price: Number = req.body.price;
    const quantity: Number = req.body.quantity;
    const userId: String = req.body.userId;

    const remainingQty = fillOrders(side, price, quantity, userId);

})

function fillOrders(side: string, price: Number, quantity: Number, userId: String) {
    let remainingQty = quantity;
    if (side == "bid") {

    }
    else {

    }
}
