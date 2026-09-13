"""The one constant that departs from the article, in one place so it is countable.

The article sleeps 60 seconds in webserver3b/3c and 3 seconds in webserver3e. Every
server here sleeps the SAME amount, so that turning the server knob changes the design
and not the clock. Marked where the reader meets it, per ADR 0002.
"""
import os

HANDLER_DELAY = float(os.environ.get('LSBAWS_DELAY', '0.5'))
