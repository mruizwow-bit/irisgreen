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

# R02 fixed/system copy remains available for the approved 30-WAV library.
fixed_expected=[
 'Puedo ayudarte a buscar información.','I can help you find information.',
 'Desactivar movimiento','Turn off motion',
 'Movimiento breve cuando cambia el estado.','Brief motion when the state changes.',
 'Comprueba la información importante en las fuentes. Sabik no realiza diagnósticos.',
 "Could not connect. You can try again or use Iris Green's search.",
 'The original quotations are in Spanish.',
]
for text in fixed_expected: assert text in joined, text

# R67 supersedes the old "retrieval unavailable" product surface.
conversation_expected=[
 'Sabik está disponible.','Sabik is available.',
 'Puedes preguntarme por escrito. Respondo con información de Iris Green y te enseño las fuentes.',
 'You can ask me in writing. I answer with Iris Green information and show the sources.',
 'Si la biblioteca Cloud no responde, uso el índice seguro local de Iris Green.',
 "If the Cloud library is unavailable, I use Iris Green’s safe local index.",
 'No se guarda el historial entre sesiones.','No history is saved between sessions.',
 'Cancelar respuesta','Cancel response',
 'conversation.submitTurn','createSabikConversation','localRetrieve'
]
for text in conversation_expected: assert text in joined, text

for superseded in [
 'La búsqueda en fuentes todavía no está disponible.','Source search is not available yet.',
 'La búsqueda en las fuentes todavía no está disponible. Puedes usar el buscador y las secciones de Iris Green.',
 "Source search is not available yet. You can use Iris Green's search and sections.",
 'Consultas no disponibles todavía','Queries are not available yet',
 'Estoy aquí si quieres ayuda.','I am here if you need help.',
]:
 assert superseded not in files['mount']+files['panel'], superseded

assert "value='SIN_MOVIMIENTO'" in files['mount']
assert 'data-low="true"' not in files['css']
print('SABIK_COPY_R67_PASS')
