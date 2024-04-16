from flask import Flask, render_template, request, render_template_string, send_from_directory

from lexer import lex
import tensorflow as tf
from gensim.models import Word2Vec
import numpy as np

model = tf.keras.models.load_model("model_4.keras")
embedding = Word2Vec.load("embedding.model")

classes = [
    "No vulnerabilities detected!",
    "CWE-119: Improper Restriction of Operations within the Bounds of a Memory Buffer",
    "CWE-120: Buffer Copy without Checking Size of Input ('Classic Buffer Overflow')",
    "CWE-469: Use of Pointer Subtraction to Determine Size"
]

prediction = None
result = None
message = None

app = Flask(__name__)

def softmax(x):
    ex = np.exp(x - np.max(x))
    return ex / ex.sum()

@app.route("/favicon.ico", methods=["GET"])
def favicon():
    return send_from_directory("./static", "cat.png")

@app.route('/', methods=['GET'])
def index():
    return render_template('/index.html')

@app.route('/detect', methods=["POST"])
def detect():
    global prediction
    global result
    global message

    json = request.get_json() 
    code = json['code']

    try:
        lexed = lex(code)
        embedded = np.array([embedding.wv[s] for s in lexed])

        na_vector = embedding.wv['<|na|>']
        while len(embedded) < 1022:
            embedded = np.append(embedded, [na_vector], axis=0)
        
        embedded = embedded.reshape((1, 1022, 15))

        data = tf.data.Dataset.from_tensor_slices(embedded).batch(1)

        _prediction = model.predict(data)[0, :-2]
    except:
        return render_template('/error.html')
    
    _prediction = softmax(_prediction)
    c = np.argmax(_prediction)
    if c == 0:
        result = "safe :)"
    else:
        result = "vulnerable :("
    message = classes[c]

    _prediction = {k: v*100 for k, v in zip(["Safe", "CWE-119", "CWE-120", "CWE-469"], _prediction)}
    _prediction = dict(sorted(_prediction.items(), key=lambda item: -item[1]))
    print(_prediction)
    prediction = "\n".join([f"{k}: {v:.2f}%" for k, v in _prediction.items()])

    return {}


@app.route('/results', methods=['GET'])
def results():
    global prediction
    global result
    global message

    print(prediction)
    print(result)
    print(message)
    return render_template("/results.html", prediction=prediction, result=result, message=message)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
