"""Adapt otb-gherkin 0.5.0 output to stock ITB 1.30.2, then package it.

Contract: ISAITB/gitb tag 1.30.2, HttpMessagingHandlerV2 and the
gitb-testbed-service receive-result fixtures. Never change source features.
"""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

TDL = 'http://www.gitb.com/tdl/v1/'
CORE = 'http://www.gitb.com/core/v1/'
ET.register_namespace('', TDL)
ET.register_namespace('gitb', CORE)


def tag(name):
    return f'{{{TDL}}}{name}'


def normalize(tree):
    actors = tree.find(tag('actors'))
    if actors is not None and tree.tag == tag('testcase'):
        actors.set('userName', 'Test operator')
        simulated = [a.get('id') for a in actors if a.get('role') == 'SIMULATED'
                     and a.get('id') != 'FHIRValidator']
        for send in tree.iter(tag('send')):
            if send.get('to') == 'FHIRValidator':
                if len(simulated) != 1:
                    raise ValueError('Expected one test-harness actor for validator calls')
                send.set('from', simulated[0])
                if send.get('desc', '').startswith('FHIRPath '):
                    send.set('desc', 'Evaluate FHIRPath')
    for verify in tree.iter(tag('verify')):
        description = verify.get('desc', '')
        if description.startswith('$found at Bundle.entry.where('):
            resource_type = re.search(r'ofType\((\w+)\)', description)
            if resource_type:
                verify.set('desc', f'Matches are {resource_type[1]} with patient references')
            elif '.distinct().count() = 1' in description:
                verify.set('desc', 'Matches refer to one patient')
            elif '.distinct().single()' in description:
                verify.set('desc', 'Matches refer to the requested patient')
            elif description.endswith('.exists() is true'):
                verify.set('desc', 'Search returns matching entries')
    # HttpMessagingV2 exposes incoming content below request, with uri rather
    # than path. StringValidator has no contains mode: use an XPath assertion.
    for element in tree.iter():
        if element.text:
            element.text = re.sub(r'\$lastReceived\{(method|path|body|headers)\}',
                lambda m: '$lastReceived{request}{' + ('uri' if m[1] == 'path' else m[1]) + '}', element.text)
            # Java HttpClient exposes response header names in lowercase.
            element.text = re.sub(r'(\$lastRequest\{response\}\{headers\})\{([^{}]+)\}',
                lambda m: m[1] + '{' + m[2].lower() + '}', element.text)
        if element.tag == tag('send') and element.get('handler') == 'HttpMessagingV2':
            uri = element.find(f"{tag('input')}[@name='uri']")
            if uri is not None and not uri.text.startswith('iri-to-uri('):
                # Token searches contain pipes; the HTTP handler requires a URI.
                uri.text = f'iri-to-uri({uri.text})'
        if element.tag == tag('verify') and element.get('handler') == 'StringValidator':
            inputs = {child.get('name'): child for child in element.findall(tag('input'))}
            mode = inputs.get('matchType')
            if mode is not None:
                if mode.text != '"contains"':
                    raise ValueError(f'Unsupported string match: {mode.text}')
                expression = f"contains({inputs['actualstring'].text}, {inputs['expectedstring'].text})"
                for child in list(element):
                    element.remove(child)
                element.set('handler', 'ExpressionValidator')
                ET.SubElement(element, tag('input'), name='expression').text = expression

    steps = tree.find(tag('steps'))
    if steps is None:
        return
    transactions = {s.get('txnId') for s in steps
                    if s.tag == tag('btxn') and s.get('handler') == 'HttpMessagingV2'}
    for step in list(steps):
        if step.tag in (tag('btxn'), tag('etxn')) and step.get('txnId') in transactions:
            steps.remove(step)
    # A reply is receive/result/output, not an outgoing HTTP send. Keep the
    # assertions between receive and reply inside result/steps so the response
    # is computed only after inspecting the actual incoming request.
    for receive in list(steps):
        if receive.tag != tag('receive') or receive.get('txnId') not in transactions:
            continue
        transaction = receive.attrib.pop('txnId')
        timeout = receive.find(f"{tag('input')}[@name='timeout']")
        if timeout is not None:
            receive.set('timeout', str(int(timeout.text.strip('"')) * 1000))
            receive.set('timeoutIsError', 'true')
            receive.remove(timeout)
        following = list(steps)[list(steps).index(receive) + 1:]
        reply = next((s for s in following if s.tag == tag('send') and s.get('txnId') == transaction), None)
        if reply is None:
            raise ValueError('Receive has no matching reply')
        between = following[:following.index(reply)]
        if any(s.tag == tag('receive') for s in between):
            raise ValueError('Overlapping receive/reply pairs are not supported')
        result = ET.SubElement(receive, tag('result'))
        if between:
            nested = ET.SubElement(result, tag('steps'), stopOnError='true')
            for step in between:
                steps.remove(step)
                nested.append(step)
        for value in reply.findall(tag('input')):
            ET.SubElement(result, tag('output'), name=value.get('name')).text = value.text
        steps.remove(reply)


def package(directory):
    for file in sorted(directory.glob('*.xml')):
        tree = ET.parse(file)
        normalize(tree.getroot())
        ET.indent(tree, space='  ')
        tree.write(file, encoding='utf-8', xml_declaration=True)
    with ZipFile(directory / 'suite.zip', 'w', ZIP_DEFLATED) as archive:
        for file in sorted(directory.rglob('*.xml')):
            archive.write(file, file.relative_to(directory))


if __name__ == '__main__':
    package(Path(sys.argv[1]))
