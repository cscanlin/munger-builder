from threading import current_thread

_requests = {}

def current_user():
    t = current_thread()
    if t not in _requests:
        return None
    return _requests[t].user

class RequestMiddleware(object):
    def process_request(self, request):
        _requests[current_thread()] = request
