from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
files={
 'mount':(ROOT/'sabik/iris-mount.mjs').read_text(encoding='utf-8'),
 'panel':(ROOT/'sabik/iris-panel.html').read_text(encoding='utf-8'),
 'retrieval':(ROOT/'sabik/retrieval-panel.js').read_text(encoding='utf-8'),
 'web':(ROOT/'sabik/sabik-web-r01.js').read_text(encoding='utf-8'),
 'css':(ROOT/'sabik/iris-mount.css').read_text(encoding='utf-8'),
}
joined='\n'.join(files.values())
expected=[
 'La búsqueda en fuentes todavía no está disponible.','Source search is not available yet.',
 'La búsqueda en fuentes está disponible.','Source search is available.',
 'Puedo ayudarte a buscar información.','I can help you find information.',
 'La búsqueda en las fuentes todavía no está disponible. Puedes usar el buscador y las secciones de Iris Green.',
 "Source search is not available yet. You can use Iris Green's search and sections.",
 'Puedo buscar información en las fuentes de Iris Green. No hago diagnósticos.',
 "I can search Iris Green's sources for information. I don't make diagnoses.",
 'Desactivar movimiento','Turn off motion',
 'Movimiento breve cuando cambia el estado.','Brief motion when the state changes.',
 'No se guarda el historial entre sesiones.',
 'Comprueba la información importante en las fuentes. Sabik no realiza diagnósticos.',
 "Could not connect. You can try again or use Iris Green's search.",
 'The original quotations are in Spanish.',
 'No hay resultados en Iris Green para esta consulta.','There are no results in Iris Green for this query.',
 'No se pudieron cargar los resultados de Iris Green. Puedes intentarlo de nuevo.',
 'La consulta se ha cancelado. No se mostrarán resultados anteriores.',
 'The query has been cancelled. Earlier results will not be shown.',
 'No se pudieron cargar los resultados. Puedes intentarlo de nuevo.'
]
for text in expected: assert text in joined, text
for legacy in [
 'Consultas no disponibles todavía','Queries are not available yet','Consulta de fuentes disponible','Source search available',
 'Estoy aquí si quieres ayuda.','I am here if you need help.','Bajar intensidad','Lower intensity',
 'Movimiento breve solo cuando hace falta.','Brief motion only when needed.',
 'No guarda historial entre sesiones.','No hay resultados de Iris Green para esta consulta.',
 'There are no Iris Green results for this query.','La consulta se canceló. No se mostrarán resultados antiguos.'
]: assert legacy not in joined, legacy
assert "value='SIN_MOVIMIENTO'" in files['mount']
assert 'data-low="true"' not in files['css']
print('SABIK_COPY_R02_PASS')
