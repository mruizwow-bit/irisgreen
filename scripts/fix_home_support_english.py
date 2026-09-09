#!/usr/bin/env python3
from pathlib import Path
import json

p = Path('index.html')
s = p.read_text(encoding='utf-8')

translations = {
    'Informe psicopedagógico': 'Psychoeducational report',
    'Lo hace el equipo de orientación del colegio. Sin él casi no se puede pedir nada más.': "The school's guidance team prepares it. Without it, very little else can be requested.",
    'Adaptaciones metodológicas': 'Teaching and assessment adjustments',
    'Más tiempo, examen en otro formato, sitio con menos ruido.': 'More time, an exam in a different format, a quieter place.',
    'Dictamen de escolarización': 'School placement report',
    'Solo si se valoran apoyos específicos o cambio de modalidad.': 'Only when specific support or a change of educational placement is being considered.',
    'Evaluación psicopedagógica (USAER)': 'Psychoeducational assessment (USAER)',
    'Se solicita por la escuela; da acceso al apoyo del equipo USAER.': 'Requested through the school; it provides access to support from the USAER team.',
    'Ajustes razonables en el aula': 'Reasonable adjustments in the classroom',
    'Reconocidos por la Ley General de Educación.': 'Recognised under the General Education Law.',
    'Proyecto Pedagógico Individual (PPI)': 'Individual Pedagogical Plan (PPI)',
    'Se acuerda entre escuela, familia y equipo interdisciplinario.': 'Agreed between the school, family and interdisciplinary team.',
    'Maestro/a de apoyo a la inclusión': 'Inclusion support teacher',
    'Suele requerir certificado del equipo tratante.': 'Usually requires a certificate from the treating team.',
    'Programa de Integración Escolar (PIE)': 'School Integration Programme (PIE)',
    'Requiere evaluación diagnóstica integral del establecimiento.': 'Requires a comprehensive diagnostic assessment by the school.',
    'Decreto 83: adecuaciones curriculares': 'Decree 83: curriculum adjustments',
    'Permite ajustar objetivos y evaluación.': 'Allows learning objectives and assessment to be adjusted.',
    'Pide por escrito la evaluación al centro': 'Ask the school for an assessment in writing',
    'Deja constancia con fecha: casi todos los sistemas parten de ahí.': 'Keep a dated record: almost every system starts there.',
    'Busca la ley de inclusión educativa de tu país': "Look up your country's inclusive education law",
    'El nombre cambia, el derecho suele existir.': 'The name varies, but the right usually exists.',
    'Ajustes razonables': 'Reasonable adjustments',
    'Se piden a la empresa. No hace falta contar todo tu diagnóstico.': 'Request them from your employer. You do not need to disclose every detail of your diagnosis.',
    'Certificado de discapacidad': 'Disability certificate',
    'Desde el 33% abre bonificaciones y reserva de puesto.': 'From a 33% disability rating, it can provide access to benefits and reserved positions.',
    'Adaptación de puesto por el servicio de prevención': 'Workplace adaptation through the occupational risk prevention service',
    'Es una vía poco conocida y suele ir más rápido.': 'This route is not widely known and is often faster.',
    'Ajustes razonables (LFT y Ley de Inclusión)': 'Reasonable adjustments (Federal Labour Law and Inclusion Law)',
    'Solicítalos por escrito a Recursos Humanos.': 'Request them in writing from Human Resources.',
    'Certificado Único de Discapacidad (CUD)': 'Unique Disability Certificate (CUD)',
    'Da acceso a cupo laboral y coberturas.': 'Provides access to employment quotas and coverage.',
    'Ley 21.015 de inclusión laboral': 'Law 21.015 on employment inclusion',
    'Obliga a cupo del 1% en empresas de 100+ personas.': 'Requires a 1% employment quota in companies with 100+ employees.',
    'Petición escrita de ajustes': 'Written request for adjustments',
    'Explica qué te cuesta y qué necesitas, no tu diagnóstico.': 'Explain what is difficult and what you need, not your diagnosis.',
    'Derivación desde atención primaria': 'Referral from primary care',
    'Pide constancia por escrito si te la deniegan.': 'Ask for written confirmation if it is refused.',
    'Unidad de salud mental o neuropediatría': 'Mental health or paediatric neurology service',
    'La espera suele ser larga. Pide el número de tu solicitud.': 'Waiting times are often long. Ask for your referral or request number.',
    'Valoración privada con informe': 'Private assessment with a written report',
    'Pregunta antes si sirve para el colegio o para el trabajo.': 'Ask beforehand whether it will be accepted for school or work.',
    'Valoración en centro de salud o CAISAME': 'Assessment at a health centre or CAISAME',
    'Pide la hoja de referencia.': 'Ask for the referral form.',
    'Turno con equipo interdisciplinario': 'Appointment with an interdisciplinary team',
    'Necesario para el CUD.': 'Required for the CUD.',
    'Evaluación en CESFAM o COSAM': 'Assessment at CESFAM or COSAM',
    'Derivación desde el consultorio.': 'Referral from the local health centre.',
    'Empieza por atención primaria': 'Start with primary care',
    'Es la puerta de entrada en casi todos los sistemas.': 'It is the entry point in almost every system.',
    'Prestación por hijo con discapacidad': 'Benefit for a child with a disability',
    'Compatible con otras ayudas familiares.': 'Can be combined with other family benefits.',
    'Grado de discapacidad ≥33%': 'Disability rating ≥33%',
    'Deducciones fiscales, transporte, ocio.': 'Tax deductions, transport and leisure concessions.',
    'Ayudas autonómicas': 'Regional benefits',
    'Cambian por comunidad: revisa la de la tuya.': 'They vary by autonomous community: check what is available in yours.',
    'Pensión para personas con discapacidad': 'Pension for people with disabilities',
    'Bienestar; requisitos por edad y estado.': 'Welfare programme; eligibility varies by age and state.',
    'Asignación por hijo con discapacidad (ANSES)': 'Child Disability Allowance (ANSES)',
    'Requiere CUD vigente.': 'Requires a valid CUD.',
    'Subsidio de discapacidad mental': 'Mental disability benefit',
    'Se solicita con la inscripción en el Registro Nacional.': 'Applied for after registration in the National Registry.',
    'Busca el registro nacional de discapacidad': 'Find your national disability register',
    'Suele ser el requisito previo a cualquier ayuda.': 'It is often the first requirement for accessing support.',
    'Terapia por la vía pública': 'Therapy through the public health system',
    'Pregunta por psicología clínica infantil o de adultos.': 'Ask about child or adult clinical psychology.',
    'Atención temprana (0-6 años)': 'Early intervention (ages 0–6)',
    'Gratuita y prioritaria; se pide desde pediatría.': 'Free and prioritised; usually requested through paediatrics.',
    'Ayudas a tratamiento privado': 'Financial support for private treatment',
    'Algunas comunidades y mutuas reembolsan parte.': 'Some autonomous communities and mutual insurers reimburse part of the cost.',
    'CRIT / centros de rehabilitación': 'CRIT / rehabilitation centres',
    'Cuotas ajustadas a ingresos.': 'Fees adjusted to income.',
    'Cobertura por Ley 24.901': 'Coverage under Law 24.901',
    'Con CUD, la obra social debe cubrir las prestaciones.': 'With a CUD, the health insurance fund must cover the services.',
    'Programa de salud mental en APS': 'Primary care mental health programme',
    'Ingreso por el consultorio.': 'Access through the local health centre.',
    'Pregunta qué cubre tu seguro o sistema público': 'Ask what your insurance or public system covers',
    'Y pide la negativa por escrito si la hay.': 'If coverage is refused, ask for the refusal in writing.',
    'Apoyos escolares': 'School support',
    'Ajustes laborales': 'Workplace adjustments',
    'Valoración o diagnóstico': 'Assessment or diagnosis',
    'Directorio de ayudas →': 'Support directory →'
}

sentinel = '"Informe psicopedagógico": { en: "Psychoeducational report"'
if sentinel not in s:
    anchor = '};\nconst tr = (s, L) =>'
    if anchor not in s:
        raise SystemExit('No se ha encontrado el final del diccionario TR')
    lines = []
    for es, en in translations.items():
        lines.append('  ' + json.dumps(es, ensure_ascii=False) + ': { en: ' + json.dumps(en, ensure_ascii=False) + ', pt: ' + json.dumps(es, ensure_ascii=False) + ' },')
    s = s.replace(anchor, '\n'.join(lines) + '\n};\nconst tr = (s, L) =>', 1)

p.write_text(s, encoding='utf-8')
print('Home support block English translations applied:', len(translations))
