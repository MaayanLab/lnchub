from flask import Flask
from flask import request
from flask import send_from_directory
from flask import render_template
import json
import os
from flask_cors import CORS, cross_origin
import traceback
import pandas as pd
import urllib.request
from waitress import serve

BASE_URL = os.environ['BASE_URL']

app = Flask(__name__, static_url_path=BASE_URL + '/static')
app.config['CORS_HEADERS'] = 'Content-Type'




cors = CORS(app, resources={r""+BASE_URL+"/api/*": {"origins": "*"}})

def readfile(fname):
    data = pd.read_csv(fname, sep="\t")
    return data


def getfile(bucket, file, fname):
    url = "https://"+bucket+".s3.amazonaws.com/"+file
    urllib.request.urlretrieve(url, fname)
    return readfile(fname)


#-----------------------------------------

pathways = getfile("mssm-lnchub", "lnc_pathway.tsv", "pathway.tsv")
print(pathways.head())
phenotypes = getfile("mssm-lnchub", "lnc_phenotype.tsv", "phenotype.tsv")
print(phenotypes.head())
processes = getfile("mssm-lnchub", "lnc_process.tsv", "process.tsv")
print(processes.head())
genes = getfile("mssm-lnchub", "lnc_similarity.tsv", "genes.tsv")
print(genes.head())

lncRNAs = list(pathways.index.values)
domains = ["pathway", "phenotype", "process", "gene"]

#-----------------------------------------

@app.route(BASE_URL +'/api/lnc', methods=["GET"])
def getprediction():
    try:
        print("get enrichment")
        
        lnc = request.args.get('lnc')
        domain = request.args.get('domain')
        
        print(lnc+" - "+domain)
        
        offset = 1
        limit = 500
        
        if 'offset' in request.args:
            offset = max(1, int(request.args.get('offset')))
        
        if 'limit' in request.args:
            limit = max(1, int(request.args.get('limit')))
        
        if domain not in domains:
            return json.dumps("invalid domain")
        
        if lnc not in lncRNAs:
            return json.dumps("invalid lnc")
        
        if domain == "pathway":
            scores = list(pathways.loc[lnc, :])
            attributes = list(pathways.columns.values)
        elif domain == "phenotype":
            scores = list(phenotypes.loc[lnc, :])
            attributes = list(phenotypes.columns.values)
        elif domain == "process":
            scores = list(processes.loc[lnc, :])
            attributes = list(processes.columns.values)
        elif domain == "gene":
            scores = list(genes.loc[lnc, :])
            attributes = list(genes.columns.values)
        
        scores, attributes = zip(*sorted(zip(scores, attributes), reverse = True))
        
        data = {
            "lncrna": lnc,
            "domain": domain,
            "attributes": attributes[min(offset, len(attributes)):min(offset+limit, len(attributes))],
            "association_score": scores[min(offset, len(attributes)):min(offset+limit, len(attributes))]
        }
        return json.dumps(data)
        
    except Exception:
        return traceback.format_exc()


@app.route(BASE_URL + '/api/listlnc', methods=["GET"])
def getlnc():
    try:
        resp  = json.dumps(lncRNAs)
        return resp
       
    except Exception:
        return traceback.format_exc()

@app.route(BASE_URL + '/')
def root():
    print("root")
    return render_template('index.html')



