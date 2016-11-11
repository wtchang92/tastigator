from rest_framework import permissions

POST_AND_GET_METHODS = ["POST","GET"]
NOT_POST_BUT_UNSAFE_METHODS = ["PUT","PATCH","DELETE"]
DANGEROUS_METHODS = ["POST","DELETE"]
EDIT_METHODS = ["PUT","PATCH"]
ALL_BUT_POST_AND_DEL_METHODS = ["GET","PUT","PATCH"]

class Is_Guide_User(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if request.method in ALL_BUT_POST_AND_DEL_METHODS and request.user.is_authenticated():
            return True
        elif request.method == "POST":
            if request.user.is_authenticated():
                if request.user.foodie.is_guide or request.user.is_staff:
                    return True
            else:
                return False
        return False

class IsOwnerOrStaffElseReadOrPostonly(permissions.BasePermission):
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