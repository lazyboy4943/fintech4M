import sqlite3


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

query1 = "CREATE TABLE users (user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, total_money REAL DEFAULT 100 NOT NULL, credits INTEGER DEFAULT 0 NOT NULL);"
query2 = "CREATE TABLE invests (invest_obj_id varchar(20) PRIMARY KEY NOT NULL, name varchar(200) NOT NULL, value REAL NOT NULL, type varchar(9) NOT NULL);"
query3 = "CREATE TABLE owned_invests (investor INTEGER NOT NULL, investment varchar(20) NOT NULL, num_invests INTEGER NOT NULL DEFAULT 1, FOREIGN KEY(investor) REFERENCES users(user_id), FOREIGN KEY(investment) REFERENCES invests(invest_obj_id));"
query4 = "CREATE TABLE transactions (transactor INTEGER NOT NULL, type varchar(1) NOT NULL, transactee varchar(20) NOT NULL, time DATETIME DEFAULT CURRENT_TIMESTAMP);"

executeWriteQuery(db, query1, ())
executeWriteQuery(db, query2, ())
executeWriteQuery(db, query3, ())
executeWriteQuery(db, query4, ())
