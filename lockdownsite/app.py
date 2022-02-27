from flask import render_template, redirect, Flask, session, request, jsonify, make_response
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
import json

# ReturnValues returns a tuple of 8 lists: FordMotorCompany, Facebook, RoyalDutchShell, Tesla, Coinbase, Bitcoin, Ethereum, IndexedFund (all of length 48)
from LiveValues import ReturnValues, randomize_val

from helpers import apology, getConnection, executeReadQuery, executeWriteQuery, lookup

# configure application, use filesystem insted of cookies, make sure responses aren't cached
app = Flask(__name__)
db = getConnection("moneys.db")

app.config["TEMPLATES_AUTO_RELOAD"] = True


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route('/')
def hello():
    return render_template("index.html")


@app.route("/game/level1", methods=["GET", "POST"])
def level1():
    if request.method == "GET":
        return render_template("gamelvl1.html")

    return redirect("/game/level2")


@app.route("/game/level2")
def level2():
    return render_template("gamelvl2.html")


@app.route("/game/level3")
def level3():
    query = "SELECT invest_obj_id, name, value FROM invests WHERE type = 'stock';"
    stocks = executeReadQuery(db, query, ())
    query = "SELECT invest_obj_id, name, value FROM invests WHERE type = 'crypto';"
    cryptos = executeReadQuery(db, query, ())
    return render_template("gamelvl3.html", stocks=stocks, cryptos=cryptos)


@app.route("/buy", methods=["POST", "GET"])
def buy():
    if request.method == "POST":
        data = request.json
        user_id = data["userID"]
        amt = float(data["amt"])
        symbol = data["stock"]
        query = "SELECT value FROM invests WHERE invest_obj_id = ?"
        value = executeReadQuery(db, query, (symbol,))[0][0]
        cost = value * amt
        query = "SELECT total_money, wallet FROM users WHERE user_id = ?"
        moneys = executeReadQuery(db, query, (user_id,))[0]
        if cost > moneys[1]:
            return jsonify(status=401, msg="Not enough money")
        total = moneys[0] - cost
        wallet = moneys[1] - cost
        query = "UPDATE users SET total_money = ?, wallet = ? WHERE user_id = ?"
        if executeWriteQuery(db, query, (total, wallet, user_id,)):
            query = "INSERT INTO transactions (transactor, type, transactee) VALUES (?, 'b', ?);"
            if executeWriteQuery(db, query, (user_id, symbol,)):
                return jsonify(status=200)
        return jsonify(status=401, msg="something wrong")


@app.route("/apply_interest", methods=["POST", "GET"])
def apply_interest():
    if request.method == "POST":
        user_id = request.json["userID"]
        query, uid = "SELECT bank_money, total_money FROM users WHERE user_id = ?", (
            user_id,)
        moneys = executeReadQuery(db, query, uid)[0]
        added_money = moneys[0] * 0.008
        bank = round((moneys[0] + added_money), 2)
        total = round((moneys[1] + added_money), 2)
        query = "UPDATE users SET bank_money = ?, total_money = ? WHERE user_id = ?"
        vals = (bank, total, user_id,)
        if executeWriteQuery(db, query, vals):
            return jsonify(status=200)
        return jsonify(status=401)


@app.route("/update", methods=["POST", "GET"])
def update():
    query = "SELECT value, type, invest_obj_id FROM invests WHERE type = 'stock' OR type ='crypto'"
    data = executeReadQuery(db, query, ())
    for d in data[6:]:
        newVal = randomize_val(d[0], d[1])
        query = "UPDATE invests SET value = ? WHERE invest_obj_id = ?"
        if executeWriteQuery(db, query, (newVal, d[2],)):
            pass

    for d in data[:6]:
        newVal = lookup(d[2])["price"]
        query = "UPDATE invests SET value = ? WHERE invest_obj_id = ?"
        if executeWriteQuery(db, query, (newVal, d[2],)):
            pass

    query = "SELECT invest_obj_id, name, value FROM invests WHERE type = 'stock';"
    stocks = executeReadQuery(db, query, ())
    query = "SELECT invest_obj_id, name, value FROM invests WHERE type = 'crypto';"
    cryptos = executeReadQuery(db, query, ())
    return jsonify(status=200, cryptos=cryptos, stocks=stocks)


@app.route('/entryform')
def entryform():
    return render_template("entryform.html")


@app.route("/get_money", methods=["GET", "POST"])
def get_money():
    if request.method == "POST":
        user_id = request.json
        query = "SELECT total_money, wallet, bank_money FROM users WHERE user_id = ?;"
        moneys = executeReadQuery(db, query, (user_id["userID"],))[0]
        if moneys:
            return jsonify(status=200, total=moneys[0], wallet=moneys[1], bank=moneys[2])
        return jsonify(status=401)


@app.route("/bank/withdraw", methods=["GET", "POST"])
def withdraw():
    if request.method == "POST":
        details = request.json
        user_id = details["userID"]
        operation = details["operation"][0]
        amt = float(details["amt"])
        query, vals = "INSERT INTO transactions (transactor, type, transactee) VALUES (?, ?, 'LBLbank');", (
            user_id, operation,)
        if executeWriteQuery(db, query, vals):
            query = "SELECT bank_money, wallet FROM users WHERE user_id = ?"
            moneys = executeReadQuery(db, query, (user_id,))[0]
            if amt > moneys[0]:
                amt = moneys[0]
            bank = moneys[0] - amt
            wallet = moneys[1] + amt
            query = "UPDATE users SET bank_money = ?, wallet = ? WHERE user_id = ?"
            if executeWriteQuery(db, query, (bank, wallet, user_id,)):
                return jsonify(status=200, bank=bank, wallet=wallet)

        return jsonify(status=401)


@app.route("/bank/deposit", methods=["GET", "POST"])
def deposit():
    if request.method == "POST":
        details = request.json
        user_id = details["userID"]
        operation = details["operation"][0]
        amt = float(details["amt"])
        query, vals = "INSERT INTO transactions (transactor, type, transactee) VALUES (?, ?, 'LBLbank');", (
            user_id, operation,)
        if executeWriteQuery(db, query, vals):
            query = "SELECT bank_money, wallet FROM users WHERE user_id = ?"
            moneys = executeReadQuery(db, query, (user_id,))[0]
            if amt > moneys[1]:
                amt = moneys[1]
            bank = moneys[0] + amt
            wallet = moneys[1] - amt
            query = "UPDATE users SET bank_money = ?, wallet = ? WHERE user_id = ?"
            if executeWriteQuery(db, query, (bank, wallet, user_id,)):
                return jsonify(status=200, bank=bank, wallet=wallet)

        return jsonify(status=401)


@app.route("/signinuser", methods=["GET", "POST"])
def signinuser():
    if request.method == "POST":
        user_id = request.json
        query = "INSERT INTO users (user_id) VALUES (?);"
        if executeWriteQuery(db, query, (user_id["userID"],)):
            return jsonify(status=200)
        else:
            return jsonify(status=401)


def errorhandler(e):
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)
