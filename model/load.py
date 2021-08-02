from tensorflow.keras.models import model_from_json
from tensorflow.python.framework import ops
import os
import re


def load_model():
    p = os.getcwd()+r'/model/model.json'
    json_file = open(p,'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    p = os.getcwd()+r'/model/model.h5'
    loaded_model.load_weights(p)
    loaded_model.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])
    graph = ops.reset_default_graph()
    return loaded_model,graph
