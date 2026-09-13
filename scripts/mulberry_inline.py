#!/usr/bin/env python3
"""Inline the <style> class rules of Mulberry SVGs as presentation attributes.

Mulberry symbols colour their shapes via a <style> block (.st0{fill:#…}).
Design tools and HTML sanitizers often strip <style> from SVG, which turns the
symbol into a flat black silhouette. Inlining fill/stroke as attributes makes
the colours survive inlining, sanitizing and <img> use alike.

Usage: python3 mulberry_inline.py IN.svg OUT.svg
"""
import re, sys
import xml.etree.ElementTree as ET

NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", NS)

def parse_css(css):
    rules = {}
    for sel, body in re.findall(r"([^{}]+)\{([^{}]*)\}", css):
        props = {}
        for decl in body.split(";"):
            if ":" in decl:
                k, v = decl.split(":", 1)
                props[k.strip()] = v.strip()
        for s in sel.split(","):
            s = s.strip()
            if s.startswith("."):
                rules.setdefault(s[1:], {}).update(props)  # later rules override
    return rules

def inline(src, dst):
    tree = ET.parse(src); root = tree.getroot()
    css = ""
    for st in root.iter(f"{{{NS}}}style"):
        css += st.text or ""
    rules = parse_css(css)
    # remove <style> and <metadata>
    for parent in root.iter():
        for child in list(parent):
            if child.tag in (f"{{{NS}}}style", f"{{{NS}}}metadata"):
                parent.remove(child)
    root.attrib.pop("id", None)
    for k in list(root.attrib):
        if k.startswith("xmlns:c2pa") or "c2pa" in k:
            root.attrib.pop(k)
    for el in root.iter():
        cls = el.attrib.pop("class", None)
        if not cls:
            continue
        for c in cls.split():
            for k, v in rules.get(c, {}).items():
                el.set(k, v)
    # nothing may stay unpainted: default fill for shapes without any fill/stroke
    for el in root.iter():
        tag = el.tag.split("}")[-1]
        if tag in ("path", "circle", "rect", "ellipse", "polygon", "polyline", "line") and "fill" not in el.attrib and "stroke" not in el.attrib:
            el.set("fill", "#231f20")
    tree.write(dst, xml_declaration=False, encoding="unicode")

if __name__ == "__main__":
    inline(sys.argv[1], sys.argv[2])
