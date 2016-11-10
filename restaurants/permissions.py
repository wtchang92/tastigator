from rest_framework import permissions

POST_AND_GET_METHODS = ["POST","GET"]
NOT_POST_BUT_UNSAFE_METHODS = ["PUT","PATCH","DELETE"]
DANGEROUS_METHODS = ["POST","DELETE"]
EDIT_METHODS = ["PUT","PATCH"]
ALL_BUT_POST_AND_DEL_METHODS = ["GET","PUT","PATCH"]

class IsStaffOrTargetUser(permissions.BasePermission):
    def has_permission(self, request, view):
        print("p1")
        if request.user.is_authenticated() and request.method in POST_AND_GET_METHODS:
            print("p2")
            return True
        elif request.user.is_authenticated() and request.method in EDIT_METHODS:
            print("patch list")
            return True
        print("p3")
        return False

    def has_object_permission(self, request, view, obj):
        print("p4")
        if request.user.is_authenticated() and request.method == "GET":
            print("p5")
            return True
        elif request.user.is_authenticated() and request.method in EDIT_METHODS:
            print("p6")
            if obj.foodie == request.user.foodie:
                print("p7")
                return True
            else:
                print("p8")
                return False
        print("p9")
        return False


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list all users if logged in user is staff
        return request.user.is_authenticated() and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # allow logged in user to view own details, allows staff to view all records
        return request.user.is_staff

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

    # def has_object_permission(self, request, view, obj):
    #     if hasattr(request.user, 'foodie'):
    #         return request.user.is_authenticated() and (request.user.foodie.is_guide or request.user.is_staff)
    #     else:
    #         return False

class IsOwnerOrStaffElseReadonly_Vote(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated()
    def has_object_permission(self, request, view, obj):
            return obj.foodie.user == request.user or request.user.is_staff
