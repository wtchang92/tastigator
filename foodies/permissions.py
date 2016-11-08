from rest_framework import permissions

POST_AND_GET_METHODS = ["POST","GET"]
NOT_POST_BUT_UNSAFE_METHODS = ["PUT","PATCH","DELETE"]
DANGEROUS_METHODS = ["POST","DELETE"]
EDIT_METHODS = ["PUT","PATCH"]


class IsAnonCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST" and not request.user.is_authenticated():
            return True
        elif not request.user.is_authenticated() and request.method != "POST":
            return False
        elif request.method in permissions.SAFE_METHODS:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated():
            return False
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.username == request.user.username

class ProfileAuthenticatedBasic(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated() and request.method in permissions.SAFE_METHODS:
            return True
        elif request.user.is_authenticated() and request.method in EDIT_METHODS:
            return True
        return False

class ProfileImagePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated() and request.method in POST_AND_GET_METHODS:
            return True
        return False


class IsStaffOrTargetUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list all users if logged in user is staff
        return request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # allow logged in user to view own details, allows staff to view all records
        return request.user.is_staff or obj == request.user


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list all users if logged in user is staff
        return request.user.is_authenticated() and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # allow logged in user to view own details, allows staff to view all records
        return request.user.is_staff