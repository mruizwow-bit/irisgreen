#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CONTRACT_PATH=ROOT/"config/release/browser-storage-contract-r0.json"

CALL_RE=re.compile(
    r"\b(?:window\s*\.\s*)?(?P<storage>localStorage|sessionStorage)\s*\.\s*"
    r"(?P<action>getItem|setItem|removeItem)\s*\(\s*(?P<arg>[^,\)\n]{1,240})",
    re.I,
)
CONST_RE=re.compile(
    r"\b(?:var|let|const)\s+(?P<name>[A-Za-z_$][\w$]*)\s*=\s*"
    r"(?P<quote>['\"])(?P<value>[^'\"]+)(?P=quote)"
)
STRING_RE=re.compile(r"(?P<quote>['\"])(?P<value>[^'\"]+)(?P=quote)")
IDENT_RE=re.compile(r"^[A-Za-z_$][\w$]*$")
CLEAR_RE=re.compile(
    r"\b(?:window\s*\.\s*)?(?P<storage>localStorage|sessionStorage)\s*\.\s*clear\s*\(",
    re.I,
)
DANGEROUS={
    "escritura document.cookie":re.compile(r"\bdocument\s*\.\s*cookie\s*=",re.I),
    "Cookie Store API":re.compile(r"\bcookieStore\s*\.\s*(?:set|delete)\s*\(",re.I),
    "IndexedDB":re.compile(r"\bindexedDB\s*\.\s*(?:open|deleteDatabase)\s*\(",re.I),
}

def line_number(text,pos): return text.count("\n",0,pos)+1
def constants(text): return {m.group("name"):m.group("value") for m in CONST_RE.finditer(text)}

def literal_keys(arg, consts):
    arg=arg.strip()
    if IDENT_RE.fullmatch(arg) and arg in consts:
        return [consts[arg]]
    m=STRING_RE.fullmatch(arg)
    if m:
        return [m.group("value")]
    if "?" in arg:
        return list(dict.fromkeys(m.group("value") for m in STRING_RE.finditer(arg)))
    return []

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",type=Path,default=Path("dist"))
    ap.add_argument("--contract",type=Path,default=CONTRACT_PATH)
    a=ap.parse_args()
    root=a.root.resolve()
    contract=json.loads(a.contract.resolve().read_text(encoding="utf-8"))
    allowed={s:{k:set(v["actions"]) for k,v in ks.items()} for s,ks in contract["storage"].items()}
    dynamic=contract.get("dynamic_bindings",{})

    calls=[];unresolved=[];clears=[];forbidden=[];disclosures=[];errors=[]
    files=sorted(p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in {".html",".js"})

    for p in files:
        text=p.read_text(encoding="utf-8",errors="ignore")
        rel=p.relative_to(root).as_posix()
        consts=constants(text)
        for m in CALL_RE.finditer(text):
            storage,action,arg=m.group("storage"),m.group("action"),m.group("arg").strip()
            keys=literal_keys(arg,consts)
            if not keys and IDENT_RE.fullmatch(arg):
                keys=list(dynamic.get(rel,{}).get(arg,[]))
            ln=line_number(text,m.start())
            if not keys:
                unresolved.append({"file":rel,"line":ln,"storage":storage,"action":action,"argument":arg})
                errors.append(f"{rel}:{ln}: clave no resoluble {arg!r}")
                continue
            for key in keys:
                calls.append({"file":rel,"line":ln,"storage":storage,"action":action,"key":key})
                if action not in allowed.get(storage,{}).get(key,set()):
                    errors.append(f"{rel}:{ln}: uso no aprobado {storage}.{action}({key!r})")

        for m in CLEAR_RE.finditer(text):
            clears.append({"file":rel,"line":line_number(text,m.start()),"storage":m.group("storage")})
            errors.append(f"{rel}: Storage.clear no aprobado")

        for label,pattern in DANGEROUS.items():
            for m in pattern.finditer(text):
                forbidden.append({"file":rel,"line":line_number(text,m.start()),"api":label})
                errors.append(f"{rel}: almacenamiento no aprobado: {label}")

    for storage,keys in contract["storage"].items():
        for key,spec in keys.items():
            for disclosure in spec.get("disclosures",[]):
                p=root/disclosure["file"]
                if p.is_file():
                    content=p.read_text(encoding="utf-8",errors="ignore")
                    missing=[x for x in disclosure.get("contains",[]) if x not in content]
                else:
                    missing=["archivo"]
                ok=not missing
                disclosures.append({"storage":storage,"key":key,"file":disclosure["file"],"ok":ok,"missing":missing})
                if not ok:
                    errors.append(f"Divulgación insuficiente para {storage}.{key}: {disclosure['file']} {missing}")

    report={
        "contract_id":contract["id"],
        "archivos_revisados":len(files),
        "llamadas_web_storage":calls,
        "llamadas_no_resueltas":unresolved,
        "disclosures":disclosures,
        "borrados_globales":clears,
        "apis_persistentes_no_aprobadas":forbidden,
        "errores":errors,
    }
    out=root/"reports/publicacion/privacidad-almacenamiento.json"
    out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"report":str(out),"archivos":len(files),"llamadas":len(calls),"errores":len(errors)},ensure_ascii=False))
    if errors:
        raise SystemExit("Auditoría de almacenamiento fallida:\n- "+"\n- ".join(errors))

if __name__=="__main__":
    main()
