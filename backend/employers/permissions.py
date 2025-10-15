from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsEmployerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_employer


class IsEmployerOrReadOnly(BasePermission):
    """
    Only employers can create/update their profile; anyone can read.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
