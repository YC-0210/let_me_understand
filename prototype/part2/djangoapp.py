# Verbatim from the article. The helloworld project it imports is NOT in the
# article - see DEPARTURES.md, inventory item 62.
import sys
sys.path.insert(0, './helloworld')
from helloworld import wsgi

app = wsgi.application
