from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmailOTP

# -----------------------------
# Custom User Admin
# -----------------------------
class UserAdmin(BaseUserAdmin):
    # Fields to display in admin
    list_display = ("email", "phone_number", "first_name", "last_name", "is_staff", "is_active", "is_verified")
    list_filter = ("is_staff", "is_active", "is_verified")
    search_fields = ("email", "phone_number", "first_name", "last_name")
    ordering = ("email",)
    readonly_fields = ("date_joined",)

    # Fields for creating/editing user in admin
    fieldsets = (
        (None, {"fields": ("email", "phone_number", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "address")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "phone_number", "first_name", "last_name", "password1", "password2", "is_staff", "is_active")}
        ),
    )

# -----------------------------
# Register Models
# -----------------------------
admin.site.register(User, UserAdmin)
admin.site.register(EmailOTP)
