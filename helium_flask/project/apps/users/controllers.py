from flask import Blueprint, request
from flask_praetorian import auth_required, current_user

from .models import User, Token
from helium_flask.project.apps.users.helpers import mail_login_token
from ...project.initialize_app import guard

user_router = Blueprint("user_router", __name__)

#Temporary usercreation for testing of token
@user_router.route("create_user/", methods=["POST"])
def create_user():
    email = request.json.get("email")
    password = request.json.get("password")
    user = User(email=email, password=guard.hash_password(password))
    user.save()
    return {}

@user_router.route("login/", methods=["POST"])
def login(request=request):
    email = request.json.get("email")
    password = request.json.get("password")
    user = guard.authenticate(email, password)
    return {"user_id": user.id, "survey_slug": user.survey_user.survey.slug,
            'access_token': guard.encode_jwt_token(user)}


@user_router.route("profile/", methods=["GET", "POST"])
@auth_required
def profile():
    if request.method == "POST":
        update_dict = {
            "email": request.json.get("email"),
            "name": request.json.get("name"),
        }
        if password := request.json.get("password"):
            update_dict["password"] = guard.hash_password(password)
        current_user().update(update_dict)
    return {
        "email": current_user().email,
        "name": current_user().name,
        "password": current_user().password,
    }


@user_router.route("forgot_password/", methods=["POST"])
def forgot_password():
    email = request.json.get("email")
    user = User.query.filter_by(email=email).first()
    if not user:
        message = "user_not_found"
    else:
        if mail_login_token(email):
            message = "success"
        else:
            message = "mail_not_sent"
    return {"message": message}


@user_router.route("send_login_link/<token>/", methods=["GET"])
def temporary_login(token):
    if token := Token.query.filter_by(token_string=token).first():
        user = User.query.filter_by(email=token.email).first()
        token.delete()
        return {"message": "success", "access_token": guard.encode_jwt_token(user)}
    else:
        return {"message": "rejected"}

@user_router.route('refresh_token/', methods=['POST'])
def refresh():
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200