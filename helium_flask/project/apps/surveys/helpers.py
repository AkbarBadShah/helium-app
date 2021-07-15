from helium_flask.project.apps.surveys.models import Answer


def generate_questions_json(questions, user_id):
    ret = []
    for question in questions:
        question_dict = {
                "id": question.id,
                "label": question.label,
                "type": question.type.label,
                "choices": question.choices,
            }
        if answer := Answer.query.filter_by(question_id=question.id, user_id=user_id).first():
            question_dict["value"] = answer.statement
        ret.append(
            question_dict
        )
    return ret
