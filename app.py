from myproject import app,db
from flask import render_template, redirect, request, url_for, flash,abort
from flask_login import login_user,login_required,logout_user
from myproject.models import User
from myproject.forms import LoginForm, RegistrationForm
from werkzeug.security import generate_password_hash, check_password_hash
import sendgrid
from sendgrid import SendGridAPIClient
import os
from sendgrid.helpers.mail import Mail, Email, To, Content
#'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'
sg=SendGridAPIClient('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')
from transformers import pipeline
sentiment_pipeline = pipeline("sentiment-analysis")


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route("/sendmail", methods=['GET', 'POST'])
@login_required
def sendmail():
    if request.method == 'POST':
        transcript=request.form['submit']
    from_email = Email("counsyl.hack@gmail.com")
    to_email = To("alvia.naqvi.08@gmail.com")  # Change to your recipient
    subject = "Counsyl Session Complete"
    text = "Hello user! Today you used COUNSYL to log your thoughts. Here is what you said: \n"
    text = text + transcript
    list = sentiment_pipeline(transcript)
    mental_health_day = list[0]['label'].lower()
    text = text + "\n Based off of some sentiment analysis, it seems that this is a " + mental_health_day + " mental health day for you."
    if mental_health_day == "negative":
        text = text + " We at COUNSYL hope you will feel better soon. If you require immidiet medical care, plase go to https://www.mentalhealthfirstaid.org/mental-health-resources/ to leaarn more about internation mental health resources."
    else:
        text = text + " We at COUNSYL hope it continues to be a good mental health day for you."
    text += "\n - COUNSYL"
    print(text)
    content = Content("text/plain", text)
    mail = Mail(from_email, to_email, subject, content)
    mail_json = mail.get()

    response = sg.client.mail.send.post(request_body=mail_json)
    print(response.status_code)
    print(response.headers)
    return render_template('sessions.html', message_sent = True)

@app.route('/session')
@login_required
def session():
    return render_template('sessions.html', message_sent = False)

@app.route('/welcome')
@login_required
def welcome_user():
    return render_template('welcome_user.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You logged out!')
    return redirect(url_for('home'))


@app.route('/login', methods=['GET', 'POST'])
def login():

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        
        if user.check_password(form.password.data) and user is not None:

            login_user(user)
            flash('Logged in successfully.')

            next = request.args.get('next')

            if next == None or not next[0]=='/':
                next = url_for('welcome_user')

            return redirect(next)
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():
        user = User(email=form.email.data,
                    username=form.username.data,
                    password=form.password.data)

        db.session.add(user)
        db.session.commit()
        flash('Thanks for registering! Now you can login!')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

if __name__ == '__main__':
    app.run(debug=True)
