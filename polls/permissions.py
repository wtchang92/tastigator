from rest_framework import permissions

POST_AND_GET_METHODS = ["POST","GET"]
NOT_POST_BUT_UNSAFE_METHODS = ["PUT","PATCH","DELETE"]
DANGEROUS_METHODS = ["POST","DELETE"]
EDIT_METHODS = ["PUT","PATCH"]

class IsOwnerOrStaffElseReadonly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method != "DELETE" and request.user.is_authenticated():
            return True
        return False
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated():
            if request.method in EDIT_METHODS and obj.creator.user == request.user or request.user.is_staff:
                return True
            elif request.method in POST_AND_GET_METHODS:
                return True
        return False

