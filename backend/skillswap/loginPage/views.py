from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required

def signup_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)          # auto log‑in
            return redirect("dashboard")
    else:
        form = UserCreationForm()
    return render(request, "loginPage/signup.html", {"form": form})

class CustomLoginView(LoginView):
    template_name = "loginPage/login.html"
    authentication_form = AuthenticationForm

def logout_view(request):
    logout(request)
    return redirect("login")

@login_required
def dashboard(request):
    return render(request, "loginPage/dashboard.html")
