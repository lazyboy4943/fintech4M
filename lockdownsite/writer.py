import sqlite3
import os
import requests
import urllib.parse


def getConnection(db):
    connection = sqlite3.connect(db, check_same_thread=False)
    return connection


# execute a qrite query into database
def executeWriteQuery(connection, query, placeholders):
    cursor = connection.cursor()
    print(query, placeholders)
    cursor.execute(query, placeholders)
    connection.commit()
    return True


# execute a read query from database
def executeReadQuery(connection, query, placeholders):
    cursor = connection.cursor()
    print(query, placeholders)
    cursor.execute(query, placeholders)
    return cursor.fetchall()


db = getConnection("moneys.db")
"""
query1 = "CREATE TABLE users (user_id PRIMARY KEY NOT NULL, total_money REAL DEFAULT 1500 NOT NULL, wallet REAL DEFAULT 1500 NOT NULL, bank_money REAL DEFAULT 0, credits INTEGER DEFAULT 0 NOT NULL);"
query2 = "CREATE TABLE invests (invest_obj_id varchar(20) PRIMARY KEY NOT NULL, name varchar(200) NOT NULL, value REAL NOT NULL, type varchar(9) NOT NULL);"
query3 = "CREATE TABLE owned_invests (investor INTEGER NOT NULL, investment varchar(20) NOT NULL, num_invests INTEGER NOT NULL DEFAULT 1, FOREIGN KEY(investor) REFERENCES users(user_id), FOREIGN KEY(investment) REFERENCES invests(invest_obj_id));"
query4 = "CREATE TABLE transactions (transactor TEXT NOT NULL, type varchar(1) NOT NULL, transactee varchar(20) NOT NULL, time DATETIME DEFAULT CURRENT_TIMESTAMP);"
"""


def lookup(symbol):
    """Look up quote for symbol."""

    # Contact API
    try:
        api_key = "pk_c2137d40546d4c38b372cee41fd6d99f"
        response = requests.get(
            f"https://cloud.iexapis.com/stable/stock/{urllib.parse.quote_plus(symbol)}/quote?token={api_key}")
        response.raise_for_status()
    except requests.RequestException:
        return None

    # Parse response
    try:
        quote = response.json()
        return {
            "name": quote["companyName"],
            "price": float(quote["latestPrice"]),
            "symbol": quote["symbol"]
        }
    except (KeyError, TypeError, ValueError):
        return None


# USERS
# | user_id | total_money | wallet | bank_money | credits |

# INVESTS
# | invest_obj_id | name | value | type |

# OWNED_INVESTS
# | investor | investment | num_invests |

# TRANSACTIONS
# | transactor | type | transactee | time |
