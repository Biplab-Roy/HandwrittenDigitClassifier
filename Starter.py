from io import BytesIO
from model.load import load_model
from flask import Flask, render_template, url_for, request
import numpy as np
from PIL import Image
import re
import base64
import sys
import os

sys.path.append(os.path.abspath('./model'))
from load import *
app = Flask(__name__)

global model, graph
model, graph = load_model()

global output 
output = 0
def convertImage(imagData):
    imgstr = re.search(r'base64,(.*)', str(imagData)).group(0)
    imgstr = imgstr.replace(" ","+")
    return np.array(Image.open(BytesIO(base64.b64decode(imgstr[7:-3]))).convert("L").resize((28,28))).reshape((1,28,28,1))

@app.route('/', methods=['GET'])
def servePage():
    return render_template('index.html')

@app.route('/predict', methods=['GET','POST'])
def servePagePost():
    data = request.get_data()
    image_arr = convertImage(data)
    out = model.predict_classes(image_arr/255)
    print(str(out))
    return str(out)


if __name__ == "__main__":
    app.run(debug=True)
