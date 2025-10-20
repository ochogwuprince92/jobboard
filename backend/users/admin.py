from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmailOTP

# -----------------------------
# Custom User Admin
# -----------------------------
class UserAdmin(BaseUserAdmin):
    """
    Custom admin panel for the User model.
    Provides an organized interface for managing users.
    """

    # Fields displayed in the list view of the admin panel
    list_display = (
        "email",
        "phone_number",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
        "is_verified"
    )

    # Filters available in the list view for quick access
    list_filter = ("is_staff", "is_active", "is_verified")

    # Fields that can be searched using the admin search bar
    search_fields = ("email", "phone_number", "first_name", "last_name")

    # Default ordering of users in admin list view
    ordering = ("email",)

    # Fields that are read-only in the admin panel
    readonly_fields = ("date_joined",)

    # Organize fields into sections for the change user page
    fieldsets = (
        (None, {"fields": ("email", "phone_number", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "address")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

    # Fields for creating a new user from the admin panel
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "phone_number",
                "first_name",
                "last_name",
                "password1",
                "password2",
                "is_staff",
                "is_active"
            )
        }),
    )

# -----------------------------
# Register Models
# -----------------------------
admin.site.register(User, UserAdmin)  # Register the custom User model
admin.site.register(EmailOTP)        # Register the OTP model for admin management
