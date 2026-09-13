"""The /hello route. NOT from the article - the article says to clone its repo
rather than printing this file. See DEPARTURES.md and INVENTORY.md item 62."""
from django.http import HttpResponse
from django.urls import path


def hello_world(request):
    return HttpResponse(
        'Hello world from Django!\n',
        content_type='text/plain',
    )


urlpatterns = [
    path('hello', hello_world),
]
