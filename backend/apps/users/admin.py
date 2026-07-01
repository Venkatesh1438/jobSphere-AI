from django import forms
from django.contrib import admin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import User, CandidateProfile, RecruiterProfile


class UserCreationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, required=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'role', 'phone_number')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(
        help_text="Raw passwords are not stored. You can change the password in the database shell or via API."
    )

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'role', 'phone_number', 'is_active', 'is_staff', 'is_superuser')

    def clean_password(self):
        return self.initial.get("password")


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_email_verified', 'is_staff')
    list_filter = ('role', 'is_email_verified', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    readonly_fields = ('last_login', 'date_joined')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
        ('Custom Attributes', {'fields': ('role', 'is_email_verified', 'is_profile_completed', 'last_login_ip')}),
    )

    def get_form(self, request, obj=None, **kwargs):
        defaults = {}
        if obj is None:
            defaults['form'] = self.add_form
        defaults.update(kwargs)
        return super().get_form(request, obj, **defaults)


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'headline', 'resume_score', 'profile_completion')
    search_fields = ('user__email', 'headline', 'bio')


@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'designation', 'is_verified', 'verified_at')
    search_fields = ('user__email', 'company_name', 'designation')
    list_filter = ('is_verified',)
