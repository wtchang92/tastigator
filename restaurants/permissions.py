from rest_framework import permissions


class IsStaffOrTargetUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list all users if logged in user is staff
        return request.user.is_authenticated() and (view.action == 'retrieve' or request.user.is_staff)
 
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

class Is_Guide_User(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if hasattr(request.user, 'foodie'):
            return request.user.is_authenticated() and (request.user.foodie.is_guide or request.user.is_staff)
        else:
            return False

    def has_object_permission(self, request, view, obj):
        if hasattr(request.user, 'foodie'):
            return request.user.is_authenticated() and (request.user.foodie.is_guide or request.user.is_staff)
        else:
            return False

class IsOwnerOrStaffElseReadonly_Vote(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated()
    def has_object_permission(self, request, view, obj):
            return obj.foodie.user == request.user or request.user.is_staff
