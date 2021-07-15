from flask import Blueprint, request
from flask_praetorian import auth_required, current_user

from helium_flask.project.apps.surveys.helpers import generate_questions_json
from helium_flask.project.apps.surveys.models import (
    Survey,
    SurveyUser,
    Group,
    Answer,
    AnswerType,
)
from helium_flask.project.apps.users.helpers import mail_login_token
from helium_flask.project.apps.users.models import User
from helium_flask.project.project.initialize_app import db

survey_router = Blueprint("survey_router", __name__)


@survey_router.route("surveys/", methods=["GET"])
@auth_required
def take_survey():
    survey_user = current_user().survey_user
    return {"has_completed": survey_user.has_completed, "has_reports": survey_user.has_reports}

def get_current_group_info():
    c_group = current_user().survey_user.current_group
    return {"group_name": c_group.name, "group_id": c_group.id, "questions": generate_questions_json(c_group.questions, current_user().survey_user.id),
            "category_name": c_group.category.name}


@survey_router.route("current_group/", methods=["GET"])
@auth_required
def get_current_group():
    return get_current_group_info()


@survey_router.route("groups/<group_id>/<option>/", methods=["POST"])
@auth_required
def next_or_back(group_id, option):
    survey_user = current_user().survey_user
    group = Group.query.get(group_id)
    type = AnswerType.query.filter_by(label="str").first()
    answers = request.json.get("answers")
    for answer in answers.keys():
        if answer_obj := Answer.query.filter_by(question_id=answer, user_id=survey_user.id).first():
            answer_obj.update({"statement": answers[answer]})
        else:
            db.session.add(
                Answer(
                    statement=answers[answer],
                    question_id=answer,
                    user=survey_user,
                    type=type,
                )
            )
    db.session.commit()
    if option == "next":
        if group.is_last:
            survey_user.has_completed = True
            return {"message": "Survey completed!"}
        else:
            survey_user.current_group = group.next_group
            survey_user.save()
            return get_current_group_info()
    elif option == "back":
        if group.is_first:
            return {"message": "Survey completed!"}
        else:
            survey_user.current_group = group.previous_group
            survey_user.save()
            return get_current_group_info()


@survey_router.route("surveys/<survey_slug>/", methods=["GET", "POST"])
def organization_page(survey_slug):
    if survey := Survey.query.filter_by(slug=survey_slug).first():
        if request.method == 'GET':
            return {"message": "success"}
        elif request.method == 'POST':
            if request.json.get("pass_code") == survey.organization.pass_code:
                return {"message": "success"}
            else:
                return {"message": "rejected"}
    else:
        return {"message": "Invalid survey name!"}


@survey_router.route("<survey_slug>/invite/", methods=["POST"])
def invite_user(survey_slug):
    survey = Survey.query.filter_by(slug=survey_slug).first()
    email = request.json.get("email")
    user = User.query.filter_by(email=email).first()
    if user:
        return {"message": "User already exists!"}
    if mail_login_token(email):
        user = User(
            email=email,
            survey_user=SurveyUser(
                current_group=Group.query.filter_by(is_first=True)
                    .filter(Group.category_id.in_([s.id for s in survey.categories]))
                    .first(),
                survey=survey,
            ),
        )
        user.save()
        return {"message": "Mail sent and user created!"}
    else:
        return {"message": "Mail not sent!"}
