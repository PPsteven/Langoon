from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from nlp import Nlp


class sentencesReq(BaseModel):
    lang: str
    text: str


class tokenzieReq(BaseModel):
    lang: str
    text: List[str]


app = FastAPI()


@app.post("/tokenize/")
def tokenize(req: tokenzieReq):
    resp = []

    nlp = Nlp(req.lang)
    for text in req.text:
        resp.append(nlp.tokenize(text))
    return resp


@app.post("/sentences/")
def sentences(req: sentencesReq):
    nlp = Nlp(req.lang)
    return nlp.split_sentences(req.text)
