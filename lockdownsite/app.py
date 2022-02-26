from flask import render_template, redirect, Flask, session, request
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError

from helpers import apology

# configure application, use filesystem insted of cookies, make sure responses aren't cached
app = Flask(__name__)

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
    hello.user_info = [None]*5
    return render_template("index.html")


@app.route("/game/level1", methods=["GET", "POST"])
def level1():
    if request.method == "GET":
        answers = []
        for i in hello.user_info[:3]:
            if i == None:
                answers.append("")
            else:
                answers.append(i)
        return render_template("gamelvl1.html", answers=answers, answered=True)

    emo = request.form.get("val1")
    print(emo)
    mem = request.form.get("val2")
    print(mem)
    sui = request.form.get("val3")
    print(sui)
    hello.user_info[0] = emo
    hello.user_info[1] = mem
    hello.user_info[2] = sui
    for i in range(len(hello.user_info)):
        if hello.user_info[i] == '':
            hello.user_info[i] = None
    print(hello.user_info)
    return redirect("/game/level2")


@app.route("/game/level2")
def level2():
    answers = []
    for i in hello.user_info[3:]:
        if i == None:
            answers.append("")
        else:
            answers.append(i)
    return render_template("gamelvl2.html", answers=answers, answered=True)


@app.route("/processing", methods=["GET", "POST"])
def processing():
    if request.method == "GET":
        return redirect("/game/level1")

    val1 = request.form.get("val1")
    print(val1)
    val2 = request.form.get("val2")
    print(val2)
    hello.user_info[3] = val1
    hello.user_info[4] = val2
    print(hello.user_info)
    for i in range(len(hello.user_info)):
        if hello.user_info[i] == '':
            hello.user_info[i] = None
    processing.vals = []
    for i in hello.user_info:
        if i == "Too much" or i == "Always" or i == "A lot":
            processing.vals.append(100)
        elif i == "Enough" or i == "Sometimes":
            processing.vals.append(50)
        elif i == "Never" or i == "Not enough":
            processing.vals.append(0)
        else:
            return redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    print(processing.vals)
    return redirect("/results")


@app.route('/results')
def results():
    # 0-emotions, 1-memory, 2-suicidal, 3-sleep, 4-overwhelming
    diagnosis = []
    if processing.vals[2] == 100:
        diagnosis.append("Deep depression")
    elif processing.vals[2] == 50 and processing.vals[0] == 100:
        diagnosis.append("Depression")
    elif processing.vals[2] == 0 and processing.vals[0] == 50:
        diagnosis.append("Possibly in depression")
    if processing.vals[1] == 100:
        diagnosis.append("Suffers from memory loss, further tests needed")
    if processing.vals[3] == 100:
        diagnosis.append("Possible hypersomnia")
    elif processing.vals[3] == 50:
        diagnosis.append("Normal sleep patterns")
    elif processing.vals[3] == 0:
        diagnosis.append("Possibly an insomniac")
    if processing.vals[4] > 50:
        diagnosis.append("Stressed out, needs a holiday, or a break at least")
    if len(diagnosis) == 0:
        return render_template("results.html", diagnosis=diagnosis, empty=True)
    return render_template("results.html", diagnosis=diagnosis, empty=False)


@app.route('/entryform')
def entryform():
    return render_template("entryform.html")

# error handling


def errorhandler(e):
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)
