#!/usr/bin/env python3
"""R67 Aura · static recovery gates."""
from __future__ import annotations
import argparse,json
from pathlib import Path

def need(v,m):
 if not v:raise AssertionError(m)

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 r49=(root/'assets/ig-r49-transversal.js').read_text(encoding='utf-8')
 for token in ('GENERAL','AGE_0_12','AGE_13_17','AGE_18_PLUS'):need(token in r49,'R49 missing '+token)
 need("[['GENERAL',tr().defaultStage],['AGE_0_12',tr().children],['AGE_13_17',tr().teenagers],['AGE_18_PLUS',tr().adults]]" in r49,'R49 picker not canonical four-profile contract')
 need('ALL_AGES' not in r49,'R49 must not expose ALL_AGES as a user-selectable profile')
 bootstrap=(root/'assets/ig-r49-lang-bootstrap.js').read_text(encoding='utf-8')
 need('ig-age-band-v2' in bootstrap and "age='GENERAL'" in bootstrap,'R49 bootstrap still legacy')
 safe=json.loads((root/'assets/safety/search-safe-default.json').read_text(encoding='utf-8'))
 intentional=json.loads((root/'assets/safety/search-intentional-safe.json').read_text(encoding='utf-8'))
 adult=json.loads((root/'assets/safety/search-adult-full-catalog.json').read_text(encoding='utf-8'))
 for group in (safe,intentional,adult):
  need(group,'empty search contract')
  need(all(x.get('age_bands') for x in group),'search contract lost canonical age_bands')
  need(all('audience' not in x for x in group),'legacy audience taxonomy emitted in search contract')
 sabik=(root/'sabik/iris-mount.mjs').read_text(encoding='utf-8')
 for token in ('createSabikConversation','conversation.submitTurn','localRetrieve','IGSearch.search','sabik-conversation-answer'):
  need(token in sabik,'Sabik R66 text integration missing '+token)
 need('SabikRetrievalPanel.createRetrievalPanel' not in sabik,'old retrieval panel remains primary Sabik submit path')
 print(json.dumps({'r49_canonical_age':'PASS','child_safe_age_search':'PASS','sabik_text_conversation':'PASS'},ensure_ascii=False))

if __name__=='__main__':main()
