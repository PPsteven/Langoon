import json

import spacy
from typing import List

lang2mode = {
    "en": "en_core_web_sm",
    "zh-CN": "zh_core_web_sm",
}


class Nlp(object):
    def __init__(self, lang: str):
        self.doc = None
        self.sentences = []
        self.lang = lang
        model = lang2mode.get(lang)
        if model:
            self.nlp = spacy.load(model)

    def load_text(self, text: str):
        self.doc = self.nlp(text)

    def split_sentences(self, text: str = "") -> List[str]:
        if len(text) != 0:
            self.load_text(text)
        self.sentences = []

        sents = list(self.doc.sents)
        for s in sents:
            if len(str(s).strip()) == 0:
                continue
            self.sentences.append(str(s).strip())

        return self.sentences

    def tokenize(self, sent: str) -> List[dict]:
        if len(sent) == 0:
            return []

        ret = []
        for token in self.nlp(sent):
            ret.append({"text": token.text, "pos": token.pos_, "whitespace": token.whitespace_})
        return ret


if __name__ == "__main__":
    long_text = '''
    廖女士是唐静文众多求助者中的一员，她家有瘫痪的老人和年幼的小孩，每天推着婴儿车和轮椅出门散步。然而，在航空路一带，部分车辆占用了盲道，甚至有的餐馆在用餐时段指挥车辆占用人行道停放，严重影响了行人的通行。
    面对廖女士反映的问题，唐静文明白，这不仅仅是她一个人的问题，更是关乎着广大市民出行安全的问题。于是，她主动对接属地大队，联系交投公司，协调各方资源，逐一解决这些问题。 
    在唐静文的努力下，航空路5号楼下的占道停车位被取消，丰德国际楼下的户外占道停车区域安装了物理隔离，防止车辆再次占用盲道。同时，柴门鱼馆餐馆负责人也被责令在用餐时段禁止指挥车辆占道停放。此外，针对该片区餐饮店多、违停车辆突出的问题，唐静文还联合属地大队调整警力配置，采用动静结合的巡逻模式，确保交通秩序井然有序。
    '''.strip()
    m = Nlp("zh")
    m.load_text(long_text)
    s1 = m.split_sentences()[0]
    tokens = m.tokenize(s1)
    print(tokens)
